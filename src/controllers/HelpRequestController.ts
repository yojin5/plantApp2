import { HelpRequest, HelpRequestDTO, HelpResponse } from '../types/HelpRequestTypes';
import { HelpRequestEntity } from '../entities/HelpRequest';
import { HelpResponseEntity } from '../entities/HelpResponse';
import { HelpRequestRepository } from '../repositories/HelpRequestRepository';
import { UserRepository } from '../repositories/UserRepository';
import { PlantRepository } from '../repositories/PlantRepository';
import { NotificationService } from '../services/NotificationService';
import { RequestStatus } from '../enums/RequestStatus';

export class HelpRequestController {
  private requestRepository: HelpRequestRepository;
  private userRepository: UserRepository;
  private plantRepository: PlantRepository;
  private notificationService: NotificationService;

  constructor() {
    this.requestRepository = new HelpRequestRepository();
    this.userRepository = new UserRepository();
    this.plantRepository = new PlantRepository();
    this.notificationService = NotificationService.getInstance();
  }

  async createHelpRequest(
    requestData: HelpRequestDTO,
    userId: string,
    postId: string
  ): Promise<{ success: boolean; request?: HelpRequest; error?: string }> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      const plants = await Promise.all(
        requestData.plantIds.map(id => this.plantRepository.findById(id))
      );
      const plantNames = plants.filter(p => p !== null).map(p => p!.name);

      const requestEntity = new HelpRequestEntity({
        postId,
        requesterId: userId,
        requesterName: user.username,
        plantIds: requestData.plantIds,
        plantNames,
        startDate: requestData.startDate,
        endDate: requestData.endDate,
        instructions: requestData.instructions,
        location: user.location!
      });

      const savedRequest = await this.requestRepository.save(requestEntity);

      // Notify nearby users
      await this.notificationService.notifyHelpRequest(user.username);

      return { success: true, request: savedRequest };
    } catch (error) {
      console.error('Create help request error:', error);
      return { success: false, error: 'Failed to create help request' };
    }
  }

  async respondToRequest(
    requestId: string,
    helperId: string,
    message: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const request = await this.requestRepository.findById(requestId);
      if (!request) {
        return { success: false, error: 'Request not found' };
      }

      const helper = await this.userRepository.findById(helperId);
      if (!helper) {
        return { success: false, error: 'Helper not found' };
      }

      const requestEntity = new HelpRequestEntity(request);
      
      const response: HelpResponse = {
        responseId: `resp_${Date.now()}`,
        requestId,
        helperId,
        helperName: helper.username,
        message,
        status: 'PENDING',
        createdAt: new Date()
      };

      requestEntity.addResponse(response);
      await this.requestRepository.save(requestEntity);

      // Notify requester
      await this.notificationService.notifyHelpResponse(helper.username);

      return { success: true };
    } catch (error) {
      console.error('Respond to request error:', error);
      return { success: false, error: 'Failed to respond to request' };
    }
  }

  async acceptHelper(requestId: string, helperId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const request = await this.requestRepository.findById(requestId);
      if (!request) {
        return { success: false, error: 'Request not found' };
      }

      const requestEntity = new HelpRequestEntity(request);
      requestEntity.acceptHelper(helperId);
      await this.requestRepository.save(requestEntity);

      return { success: true };
    } catch (error) {
      console.error('Accept helper error:', error);
      return { success: false, error: 'Failed to accept helper' };
    }
  }

  async completeRequest(requestId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const request = await this.requestRepository.findById(requestId);
      if (!request) {
        return { success: false, error: 'Request not found' };
      }

      const requestEntity = new HelpRequestEntity(request);
      requestEntity.complete();
      await this.requestRepository.save(requestEntity);

      return { success: true };
    } catch (error) {
      console.error('Complete request error:', error);
      return { success: false, error: 'Failed to complete request' };
    }
  }

  async getMyRequests(userId: string): Promise<HelpRequest[]> {
    return await this.requestRepository.findByRequester(userId);
  }

  async getMyAcceptedHelps(userId: string): Promise<HelpRequest[]> {
    return await this.requestRepository.findByHelper(userId);
  }

  async getAllOpenRequests(): Promise<HelpRequest[]> {
    return await this.requestRepository.findByStatus(RequestStatus.OPEN);
  }
}