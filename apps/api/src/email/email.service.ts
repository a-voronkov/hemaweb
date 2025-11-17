import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private config: ConfigService) {
    // For development, use ethereal.email (fake SMTP)
    // For production, configure real SMTP
    this.initializeTransporter();
  }

  private async initializeTransporter() {
    const emailConfig = this.config.get('email');

    if (emailConfig?.host) {
      // Production SMTP
      this.transporter = nodemailer.createTransport({
        host: emailConfig.host,
        port: emailConfig.port,
        secure: emailConfig.secure,
        auth: {
          user: emailConfig.user,
          pass: emailConfig.password,
        },
      });
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
      this.logger.log(`Using Ethereal email: ${testAccount.user}`);
    }
  }

  /**
   * Send verification email
   */
  async sendVerificationEmail(to: string, token: string, name: string) {
    const verificationUrl = `${this.config.get('app.frontendUrl')}/verify-email?token=${token}`;

    const info = await this.transporter.sendMail({
      from: this.config.get('email.from') || '"HemaWeb" <noreply@hemaweb.world>',
      to,
      subject: 'Verify your email - HemaWeb',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to HemaWeb, ${name}!</h2>
          <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #dc2626; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email
            </a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px;">
            If you didn't create an account, please ignore this email.
          </p>
        </div>
      `,
    });

    this.logger.log(`Verification email sent to ${to}`);
    this.logger.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);

    return info;
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(to: string, token: string, name: string) {
    const resetUrl = `${this.config.get('app.frontendUrl')}/reset-password?token=${token}`;

    const info = await this.transporter.sendMail({
      from: this.config.get('email.from') || '"HemaWeb" <noreply@hemaweb.world>',
      to,
      subject: 'Reset your password - HemaWeb',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>Hi ${name},</p>
          <p>We received a request to reset your password. Click the button below to reset it:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #dc2626; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="color: #666; word-break: break-all;">${resetUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px;">
            If you didn't request a password reset, please ignore this email or contact support if you have concerns.
          </p>
        </div>
      `,
    });

    this.logger.log(`Password reset email sent to ${to}`);
    this.logger.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);

    return info;
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(to: string, name: string) {
    const info = await this.transporter.sendMail({
      from: this.config.get('email.from') || '"HemaWeb" <noreply@hemaweb.world>',
      to,
      subject: 'Welcome to HemaWeb!',
      html: `
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
      `,
    });

    this.logger.log(`Welcome email sent to ${to}`);
    return info;
  }
}

