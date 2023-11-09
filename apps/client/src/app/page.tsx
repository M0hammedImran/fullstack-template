import { Button, LoadableButton } from '@app/ui';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Button>Click Me</Button>
            <LoadableButton loading>Test</LoadableButton>
        </main>
    );
}
