import { Injectable } from "@nestjs/common";

type DomainEvent = {
    id: number | string;
    userId: number;
    type: string;
    payload: unknown;
};

@Injectable()
export class StreamRegistry {
    private listeners = new Map<number, (event: DomainEvent) => void>();

    createStream(userId: number): AsyncIterableIterator<DomainEvent> {
        const queue: DomainEvent[] = [];
        let wake: (() => void) | null = null;

        this.listeners.set(userId, (event) => {
            queue.push(event);

            if (wake) {
                wake();
                wake = null;
            }
        });

        async function* stream() {
            try {
                while (true) {
                    if (queue.length) {
                        yield queue.shift()!;
                        continue;
                    }
                    await new Promise<void>(r => (wake = r));
                }
            } finally {
                this.listeners.delete(userId);
            }
        }

        return stream();
    }

    push(userId: number, event: DomainEvent) {
        this.listeners.get(userId)?.(event);
    }

    remove(userId: number) {
        this.listeners.delete(userId);
    }
}
