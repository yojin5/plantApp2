import { RequestStatus } from '../enums/RequestStatus';
import { Location } from './UserTypes';

export interface HelpRequest {
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
}

export interface HelpResponse {
  responseId: string;
  requestId: string;
  helperId: string;
  helperName: string;
  message: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: Date;
}

export interface HelpRequestDTO {
  plantIds: string[];
  startDate: Date;
  endDate: Date;
  instructions: string;
}