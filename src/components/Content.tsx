import { ReactNode } from 'react';

interface ContentProps {
  children: ReactNode;
}

export default function Content({ children }: Readonly<ContentProps>) {
  return (
    <main className="grow bg-gray-50">
      <div className="container mx-auto px-4 py-8">{children}</div>
    </main>
  );
}
