import {Observable} from 'rxjs';
import { BaseDto } from 'src/app/models/base-dto.model';

export abstract class BaseDataService<T extends BaseDto> {
    public baseCollection: string;
    public abstract get(): Observable<Array<T>>;
    public abstract getOne(id: string): Observable<T>;
    public abstract update(data: Partial<T>): Promise<void>;
    public abstract delete(id: string): Promise<any>;
    public abstract create(data: T): Promise<void>;

    constructor(collection: string) {
        if (!collection) {
            throw new Error('Data service did not initialize its base collection path');
        }
        this.baseCollection = collection;
    }
}
