"use client";

import { useState } from "react";
import { HiOutlineHeart, HiOutlinePlus } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { WizardTopBar } from "./wizard-top-bar";
import { InviteCollaboratorModal } from "./invite-collaborator-modal";
import type { Collaborator } from "./order-wizard";

type StepCollaborationProps = {
  collaborators: Collaborator[];
  onAddCollaborator: (collaborator: Collaborator) => void;
  onBack: () => void;
  onNext: () => void;
};

export function StepCollaboration({
  collaborators,
  onAddCollaborator,
  onBack,
  onNext,
}: StepCollaborationProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleInvite(collaborator: Collaborator) {
    onAddCollaborator(collaborator);
    setIsModalOpen(false);
  }

  return (
    <div className="min-h-screen bg-background">
      <WizardTopBar onBack={onBack} />

      <div className="mx-auto flex max-w-md flex-col items-center px-6 pb-16 text-center sm:px-10">
        <span className="grid size-20 place-items-center rounded-full bg-secondary text-accent">
          <HiOutlineHeart className="size-10" aria-hidden="true" />
        </span>

        <h1 className="mt-6 font-serif text-2xl font-bold text-foreground">
          Undang & Kolaborasi
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Undang tim pernikahanmu untuk persiapan yang lebih matang dan
          berkesan.
        </p>

        {collaborators.length > 0 && (
          <ul className="mt-6 w-full space-y-3 text-left">
            {collaborators.map((collaborator) => (
              <li
                key={collaborator.email}
                className="flex items-center gap-3 rounded-xl border border-card-border bg-card px-4 py-3"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-sm font-semibold text-primary uppercase">
                  {collaborator.name.charAt(0)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {collaborator.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {collaborator.email}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}

        <Button
          type="button"
          variant="outline-brand"
          className="mt-6 h-10 rounded-full px-6"
          onClick={() => setIsModalOpen(true)}
        >
          <HiOutlinePlus className="size-4" aria-hidden="true" />
          Undang
        </Button>

        <Button
          type="button"
          variant="rose"
          className="mt-10 h-12 w-full px-8"
          onClick={onNext}
        >
          Lanjut
        </Button>
      </div>

      {isModalOpen && (
        <InviteCollaboratorModal
          onClose={() => setIsModalOpen(false)}
          onInvite={handleInvite}
        />
      )}
    </div>
  );
}
