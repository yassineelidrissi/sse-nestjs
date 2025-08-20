import { Injectable } from "@nestjs/common";

type NotificationEvent = {
    id: string;
    userId: number;
    type: string;
    payload: any;
}

@Injectable()
export class StreamRegistry {

    private listeners = new Map<number, (event: NotificationEvent) => void>();

    createStream(userId: number): AsyncIterableIterator<any> {

        const queue: NotificationEvent[] = [];
        let resolve: ((value: IteratorResult<any>) => void) | null = null;

        const format = (e: NotificationEvent) => ({
            id: e.id,
            type: e.type,
            data: JSON.stringify(e.payload)
        });

        this.listeners.set(userId, (event) => {

            if(resolve) {
                resolve({ value: format(event), done: false });
                resolve = null;
            } else {
                queue.push(event);
            }

        });

        async function* stream() {

            while(true) {
                if(queue.length) {
                    yield format(queue.shift()!);
                } else {
                    const next = await new Promise<IteratorResult<any>>(r => (resolve = r));
                    yield next;
                }
            }

        }

        return stream();

    }

    push(userId: number, event: NotificationEvent) {
        this.listeners.get(userId)?.(event);
    }

    remove(userId: number) {
        this.listeners.delete(userId);
    }
}