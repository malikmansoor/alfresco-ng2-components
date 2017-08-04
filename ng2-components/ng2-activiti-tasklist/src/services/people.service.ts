/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AlfrescoApiService, LogService, ContentService } from 'ng2-alfresco-core';
import { Observable } from 'rxjs/Rx';
import { User } from '../models/user.model';

@Injectable()
export class PeopleService {
o
    constructor(private alfrescoJsApi: AlfrescoApiService,
                private logService: LogService,
                private contentService: ContentService) {
    }

    getWorkflowUsers(taskId?: string, searchWord?: string): Observable<User[]> {
        let option = {excludeTaskId: taskId, filter: searchWord};
        return Observable.fromPromise(this.getWorkflowUserApi(option))
            .flatMap((response: any) =>  <User[]> response.data )
            .map( (user: User) => {
                this.getUserImage(user).subscribe((img)=> {
                    user.userImage = this.contentService.createTrustedUrl(img);
                });
                return user;
            })
            .catch(err => this.handleErrorImproved(err));
    }

    getUserImage(user: User): Observable<Blob> {
        return Observable.fromPromise(this.getUserProfileImageApi(user.id+''))
            .catch(err => this.handleErrorImproved(err));
    }

    involveUserWithTask(taskId: string, idToInvolve: string): Observable<User[]> {
        let node = {userId: idToInvolve};
        return Observable.fromPromise(this.involveUserToTaskApi(taskId, node))
            .catch(err => this.handleError(err));
    }

    removeInvolvedUser(taskId: string, idToRemove: string): Observable<User[]> {
        let node = {userId: idToRemove};
        return Observable.fromPromise(this.removeInvolvedUserFromTaskApi(taskId, node))
            .catch(err => this.handleError(err));
    }

    private getWorkflowUserApi(options: any) {
        return this.alfrescoJsApi.getInstance().activiti.usersWorkflowApi.getUsers(options);
    }

    private involveUserToTaskApi(taskId: string, node: any) {
        return this.alfrescoJsApi.getInstance().activiti.taskActionsApi.involveUser(taskId, node);
    }

    private removeInvolvedUserFromTaskApi(taskId: string, node: any) {
        return this.alfrescoJsApi.getInstance().activiti.taskActionsApi.removeInvolvedUser(taskId, node);
    }

    private getUserProfileImageApi(userId: string) {
        return this.alfrescoJsApi.getInstance().activiti.userApi.getProfilePicture(userId);
    }

    private handleErrorImproved(error: Response) {
        this.logService.log(error);
        return error.status === 404? null : Observable.throw(error || 'Server error');
    }

    /**
     * Throw the error
     * @param error
     * @returns {ErrorObservable}
     */
    private handleError(error: Response) {
        this.logService.error(error);
        return Observable.throw(error || 'Server error');
    }
}
