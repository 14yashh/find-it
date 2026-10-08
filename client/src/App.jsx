import React from 'react';
import Button from './components/ui/Button.jsx';
import Stamp from './components/ui/Stamp.jsx';
import TagCard from './components/ui/TagCard.jsx';
import TicketStub from './components/ui/TicketStub.jsx';

export default function App() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="font-heading font-extrabold text-3xl">FindIt Stage C0 Test</h1>
      <Button variant="primary">Test Button</Button>
      <Stamp type="found" />
      <TicketStub header="Ticket Stub Header">Stub Body</TicketStub>
    </div>
  );
}
