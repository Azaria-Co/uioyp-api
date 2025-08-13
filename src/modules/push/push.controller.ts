import { Body, Controller, Get, Post, Query, Param, Patch, Delete } from '@nestjs/common';
import { PushService } from './push.service.js';

@Controller('push')
export class PushController {
  constructor(private readonly pushService: PushService) {}

  @Post('register')
  register(@Body() body: { id_us: number; token: string; platform: string }) {
    return this.pushService.registerToken(body.id_us, body.token, body.platform || 'unknown');
  }

  @Post('reminder-time')
  setReminder(@Body() body: { hour: number; minute: number }) {
    return this.pushService.setGlobalReminder(Number(body.hour), Number(body.minute));
  }

  @Get('reminder-time')
  getReminder() {
    return this.pushService.getGlobalReminder();
  }

  @Post('patient-reminder')
  createPatientReminder(
    @Body()
    body: { id_pac: number; hour: number; minute: number; created_by: number; active?: number },
  ) {
    return this.pushService.createPatientReminder(body);
  }

  @Get('patient-reminder')
  listPatientReminders(@Query('id_pac') id_pac?: number) {
    return this.pushService.listPatientReminders(id_pac ? Number(id_pac) : undefined);
  }

  @Patch('patient-reminder/:id/active')
  setPatientReminderActive(@Param('id') id: number, @Body('active') active: number) {
    return this.pushService.setPatientReminderActive(Number(id), Number(active));
  }

  @Delete('patient-reminder/:id')
  deletePatientReminder(@Param('id') id: number) {
    return this.pushService.deletePatientReminder(Number(id));
  }
}
