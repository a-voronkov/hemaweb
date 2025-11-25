import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

// Use require for Mailjet to avoid TypeScript import issues
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Mailjet = require('node-mailjet');

@Injectable()
export class EmailService {
  private transporter: Transporter;
  private mailjet: any;
  private useMailjet: boolean = false;
  private readonly logger = new Logger(EmailService.name);

  constructor(private config: ConfigService) {
    void this.initializeEmailProvider();
  }

  private async initializeEmailProvider() {
    const emailConfig = this.config.get('email');

    // Check if Mailjet is configured
    if (emailConfig?.mailjetApiKey && emailConfig?.mailjetSecretKey) {
      this.useMailjet = true;
      this.mailjet = Mailjet.apiConnect(
        emailConfig.mailjetApiKey,
        emailConfig.mailjetSecretKey,
      );
      this.logger.log('Using Mailjet for email delivery');
    } else if (emailConfig?.host) {
      // Fallback to SMTP
      this.transporter = nodemailer.createTransport({
        host: emailConfig.host,
        port: emailConfig.port,
        secure: emailConfig.secure,
        auth: {
          user: emailConfig.user,
          pass: emailConfig.password,
        },
      });
      this.logger.log('Using SMTP for email delivery');
    } else {
      // Development: use ethereal.email
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      this.logger.log(
        `Using Ethereal email for development: ${testAccount.user}`,
      );
    }
  }

  /**
   * Send email via Mailjet
   */
  private async sendViaMailjet(to: string, subject: string, html: string) {
    const fromEmail = this.config.get('email.from') || 'noreply@hemaweb.world';
    const fromName = this.config.get('email.fromName') || 'HemaWeb';

    const request = this.mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: fromEmail,
            Name: fromName,
          },
          To: [
            {
              Email: to,
            },
          ],
          Subject: subject,
          HTMLPart: html,
        },
      ],
    });

    const result = await request;
    this.logger.log(`Email sent via Mailjet to ${to}`);
    return result.body;
  }

  /**
   * Send email via SMTP/Nodemailer
   */
  private async sendViaSmtp(to: string, subject: string, html: string) {
    const info = await this.transporter.sendMail({
      from:
        this.config.get('email.from') || '"HemaWeb" <noreply@hemaweb.world>',
      to,
      subject,
      html,
    });

    this.logger.log(`Email sent via SMTP to ${to}`);
    if (process.env.NODE_ENV === 'development') {
      this.logger.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    return info;
  }

  /**
   * Send email (auto-detect provider)
   */
  private async sendEmail(to: string, subject: string, html: string) {
    if (this.useMailjet) {
      return this.sendViaMailjet(to, subject, html);
    } else {
      return this.sendViaSmtp(to, subject, html);
    }
  }

  /**
   * Escape HTML entities
   */
  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  /**
   * Send verification email
   */
  async sendVerificationEmail(to: string, token: string, name: string) {
    const verificationUrl = `${this.config.get('app.frontendUrl')}/verify-email?token=${encodeURIComponent(token)}`;
    const escapedName = this.escapeHtml(name);

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to HemaWeb, ${escapedName}!</h2>
        <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${this.escapeHtml(verificationUrl)}"
             style="background-color: #dc2626; color: white; padding: 12px 30px;
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #666; word-break: break-all;">${this.escapeHtml(verificationUrl)}</p>
        <p>This link will expire in 24 hours.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 12px;">
          If you didn&#039;t create an account, please ignore this email.
        </p>
      </div>
    `;

    return this.sendEmail(to, 'Verify your email - HemaWeb', html);
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(to: string, token: string, name: string) {
    const resetUrl = `${this.config.get('app.frontendUrl')}/reset-password?token=${encodeURIComponent(token)}`;
    const escapedName = this.escapeHtml(name);

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Hi ${escapedName},</p>
        <p>We received a request to reset your password. Click the button below to reset it:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${this.escapeHtml(resetUrl)}"
             style="background-color: #dc2626; color: white; padding: 12px 30px;
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #666; word-break: break-all;">${this.escapeHtml(resetUrl)}</p>
        <p>This link will expire in 1 hour.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 12px;">
          If you didn&#039;t request a password reset, please ignore this email or contact support if you have concerns.
        </p>
      </div>
    `;

    return this.sendEmail(to, 'Reset your password - HemaWeb', html);
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(to: string, name: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to HemaWeb, ${name}!</h2>
        <p>Your email has been verified successfully.</p>
        <p>You can now:</p>
        <ul>
          <li>Find nearby blood drives</li>
          <li>Schedule donations</li>
          <li>Track your donation history</li>
          <li>Earn badges and achievements</li>
        </ul>
        <p>Thank you for joining our community of blood donors!</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${this.config.get('app.frontendUrl')}"
             style="background-color: #dc2626; color: white; padding: 12px 30px;
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Get Started
          </a>
        </div>
      </div>
    `;

    return this.sendEmail(to, 'Welcome to HemaWeb!', html);
  }

  /**
   * Send blood drive notification email
   */
  async sendBloodDriveNotification(
    to: string,
    name: string,
    bloodDrive: {
      title: string;
      startDateTime: string;
      medicalCenter: { name: string; city?: string };
      bloodTypesNeeded?: Array<{ bloodType: { name: string } }>;
    },
  ) {
    const driveDate = new Date(bloodDrive.startDateTime).toLocaleDateString(
      'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      },
    );

    const bloodTypesHtml = bloodDrive.bloodTypesNeeded?.length
      ? `
        <p><strong>Blood Types Needed:</strong></p>
        <p style="color: #dc2626; font-weight: bold;">
          ${bloodDrive.bloodTypesNeeded.map((bt) => bt.bloodType.name).join(', ')}
        </p>
      `
      : '';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Blood Drive Near You!</h2>
        <p>Hi ${name},</p>
        <p>A new blood drive has been scheduled in your area:</p>

        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #dc2626;">${bloodDrive.title}</h3>
          <p><strong>Date & Time:</strong> ${driveDate}</p>
          <p><strong>Location:</strong> ${bloodDrive.medicalCenter.name}${bloodDrive.medicalCenter.city ? `, ${bloodDrive.medicalCenter.city}` : ''}</p>
          ${bloodTypesHtml}
        </div>

        <p>Your donation can save up to 3 lives. Register now to secure your spot!</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${this.config.get('app.frontendUrl')}/blood-drives"
             style="background-color: #dc2626; color: white; padding: 12px 30px;
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            View Blood Drives
          </a>
        </div>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 12px;">
          You're receiving this email because you're registered as a blood donor.
          To manage your notification preferences, visit your profile settings.
        </p>
      </div>
    `;

    return this.sendEmail(to, `New Blood Drive: ${bloodDrive.title}`, html);
  }

  /**
   * Send donation eligibility reminder
   */
  async sendEligibilityReminder(
    to: string,
    name: string,
    nextEligibleDate: string,
  ) {
    const eligibleDate = new Date(nextEligibleDate).toLocaleDateString(
      'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      },
    );

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>You're Eligible to Donate Again!</h2>
        <p>Hi ${name},</p>
        <p>Great news! You're now eligible to donate blood again.</p>

        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
          <p style="margin: 0; font-size: 18px; color: #15803d;">
            <strong>You can donate starting ${eligibleDate}</strong>
          </p>
        </div>

        <p>Your previous donation made a difference, and we hope you'll consider donating again.</p>
        <p>Find a blood drive near you and schedule your next donation:</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${this.config.get('app.frontendUrl')}/blood-drives"
             style="background-color: #dc2626; color: white; padding: 12px 30px;
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Find Blood Drives
          </a>
        </div>

        <p style="color: #666; font-size: 14px;">
          Remember: Each donation can save up to 3 lives. Thank you for being a hero!
        </p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 12px;">
          To manage your notification preferences, visit your profile settings.
        </p>
      </div>
    `;

    return this.sendEmail(to, "You're Eligible to Donate Blood Again!", html);
  }

  /**
   * Send blood drive registration confirmation
   */
  async sendBloodDriveRegistrationConfirmation(
    to: string,
    name: string,
    bloodDrive: {
      title: string;
      startDateTime: string;
      medicalCenter: {
        name: string;
        address?: string;
        city?: string;
        phone?: string;
      };
    },
  ) {
    const driveDate = new Date(bloodDrive.startDateTime).toLocaleDateString(
      'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      },
    );

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Registration Confirmed!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for registering for the blood drive. Your registration has been confirmed.</p>

        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #dc2626;">${bloodDrive.title}</h3>
          <p><strong>Date & Time:</strong> ${driveDate}</p>
          <p><strong>Location:</strong> ${bloodDrive.medicalCenter.name}</p>
          ${bloodDrive.medicalCenter.address ? `<p><strong>Address:</strong> ${bloodDrive.medicalCenter.address}${bloodDrive.medicalCenter.city ? `, ${bloodDrive.medicalCenter.city}` : ''}</p>` : ''}
          ${bloodDrive.medicalCenter.phone ? `<p><strong>Phone:</strong> ${bloodDrive.medicalCenter.phone}</p>` : ''}
        </div>

        <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #92400e;">
            <strong>Important Reminders:</strong>
          </p>
          <ul style="margin: 10px 0; color: #92400e;">
            <li>Eat a healthy meal before donating</li>
            <li>Drink plenty of water</li>
            <li>Bring a valid ID</li>
            <li>Get a good night's sleep</li>
          </ul>
        </div>

        <p>We look forward to seeing you there. Thank you for saving lives!</p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 12px;">
          If you need to cancel your registration, please contact the medical center directly.
        </p>
      </div>
    `;

    return this.sendEmail(
      to,
      `Blood Drive Registration Confirmed - ${bloodDrive.title}`,
      html,
    );
  }
}
