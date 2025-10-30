import { HelpRequest } from '../types/HelpRequestTypes';
import { HelpRequestEntity } from '../entities/HelpRequest';
import { StorageService } from '../services/StorageService';
import { STORAGE_KEYS } from '../utils/constants';
import { RequestStatus } from '../enums/RequestStatus';

export class HelpRequestRepository {
  private storageService: StorageService;

  constructor() {
    this.storageService = StorageService.getInstance();
  }

  async save(request: HelpRequestEntity): Promise<HelpRequest> {
    const requests = await this.findAll();
    const index = requests.findIndex(r => r.requestId === request.requestId);
    
    if (index >= 0) {
      requests[index] = request.toJSON();
    } else {
      requests.unshift(request.toJSON());
    }
    
    await this.storageService.save(STORAGE_KEYS.HELP_REQUESTS, requests);
    return request.toJSON();
  }

  async findById(requestId: string): Promise<HelpRequest | null> {
    const requests = await this.findAll();
    return requests.find(r => r.requestId === requestId) || null;
  }

  async findByRequester(requesterId: string): Promise<HelpRequest[]> {
    const requests = await this.findAll();
    return requests.filter(r => r.requesterId === requesterId);
  }

  async findByHelper(helperId: string): Promise<HelpRequest[]> {
    const requests = await this.findAll();
    return requests.filter(r => r.acceptedHelperId === helperId);
  }

  async findByStatus(status: RequestStatus): Promise<HelpRequest[]> {
    const requests = await this.findAll();
    return requests.filter(r => r.status === status);
  }

  async findAll(): Promise<HelpRequest[]> {
    const requests = await this.storageService.get<HelpRequest[]>(STORAGE_KEYS.HELP_REQUESTS);
    return requests || [];
  }

  async delete(requestId: string): Promise<void> {
    const requests = await this.findAll();
    const filtered = requests.filter(r => r.requestId !== requestId);
    await this.storageService.save(STORAGE_KEYS.HELP_REQUESTS, filtered);
  }
}