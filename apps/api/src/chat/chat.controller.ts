import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatQueryRequest } from '@viksit/shared';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('query')
  async handleQuery(@Body() dto: ChatQueryRequest) {
    return this.chatService.processQuery(dto);
  }
}
