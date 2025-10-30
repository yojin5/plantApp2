import { HelpRequest, HelpResponse } from '../types/HelpRequestTypes';
import { RequestStatus } from '../enums/RequestStatus';
import { Location } from '../types/UserTypes';

export class HelpRequestEntity implements HelpRequest {
  requestId: string;
  postId: string;
  requesterId: string;
  requesterName: string;
  plantIds: string[];
  plantNames: string[];
  startDate: Date;
  endDate: Date;
  status: RequestStatus;
  instructions: string;
  location: Location;
  responses: HelpResponse[];
  acceptedHelperId?: string;
  createdAt: Date;

  constructor(data: Partial<HelpRequest>) {
    this.requestId = data.requestId || `hr_${Date.now()}`;
    this.postId = data.postId || '';
    this.requesterId = data.requesterId || '';
    this.requesterName = data.requesterName || '';
    this.plantIds = data.plantIds || [];
    this.plantNames = data.plantNames || [];
    this.startDate = data.startDate || new Date();
    this.endDate = data.endDate || new Date();
    this.status = data.status || RequestStatus.OPEN;
    this.instructions = data.instructions || '';
    this.location = data.location || { city: '', state: '', latitude: 0, longitude: 0 };
    this.responses = data.responses || [];
    this.acceptedHelperId = data.acceptedHelperId;
    this.createdAt = data.createdAt || new Date();
  }

  addResponse(response: HelpResponse): void {
    this.responses.push(response);
  }

  acceptHelper(helperId: string): void {
    this.acceptedHelperId = helperId;
    this.status = RequestStatus.ACCEPTED;
  }

  complete(): void {
    this.status = RequestStatus.COMPLETED;
  }

  cancel(): void {
    this.status = RequestStatus.CANCELLED;
  }

  isActive(): boolean {
    return this.status === RequestStatus.OPEN || this.status === RequestStatus.ACCEPTED;
  }

  toJSON(): HelpRequest {
    return {
      requestId: this.requestId,
      postId: this.postId,
      requesterId: this.requesterId,
      requesterName: this.requesterName,
      plantIds: this.plantIds,
      plantNames: this.plantNames,
      startDate: this.startDate,
      endDate: this.endDate,
      status: this.status,
      instructions: this.instructions,
      location: this.location,
      responses: this.responses,
      acceptedHelperId: this.acceptedHelperId,
      createdAt: this.createdAt
    };
  }
}