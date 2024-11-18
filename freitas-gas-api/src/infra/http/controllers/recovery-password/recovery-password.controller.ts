import { SendForgotEmail } from '@/application/use-cases/recovery-password/send-forgot-email';
import { Body, Controller, Post, Put, Query } from '@nestjs/common';
import { UpdatePassword } from 'src/application/use-cases/recovery-password/update-password';

@Controller('recovery-password')
export class RecoveryPasswordController {
  constructor(
    private sendForgotEmail: SendForgotEmail,
    private updatePassword: UpdatePassword,
  ) {}

  @Post('/')
  async recovery(@Body() body: { email: string }) {
    const { email } = body;

    await this.sendForgotEmail.execute({
      email,
    });

    return;
  }

  @Put('/redefine')
  async redefine(
    @Query('token') token: string,
    @Body() body: { password: string },
  ) {
    const { password } = body;

    await this.updatePassword.execute({
      newPassword: password,
      token,
    });

    return;
  }
}
