import { HelpResponse } from '../types/HelpRequestTypes';

export class HelpResponseEntity implements HelpResponse {
  responseId: string;
  requestId: string;
  helperId: string;
  helperName: string;
  message: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: Date;

  constructor(data: Partial<HelpResponse>) {
    this.responseId = data.responseId || `resp_${Date.now()}`;
    this.requestId = data.requestId || '';
    this.helperId = data.helperId || '';
    this.helperName = data.helperName || '';
    this.message = data.message || '';
    this.status = data.status || 'PENDING';
    this.createdAt = data.createdAt || new Date();
  }

  accept(): void {
    this.status = 'ACCEPTED';
  }

  reject(): void {
    this.status = 'REJECTED';
  }

  toJSON(): HelpResponse {
    return {
      responseId: this.responseId,
      requestId: this.requestId,
      helperId: this.helperId,
      helperName: this.helperName,
      message: this.message,
      status: this.status,
      createdAt: this.createdAt
    };
  }
}