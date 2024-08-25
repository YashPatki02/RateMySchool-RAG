"use client";
import React from "react";
import { useState, useEffect } from "react";
import ReloadModal from "@/components/ReloadModal";

export default function Chat() {
  const [showModal, setShowModal] = useState(false);
  const [shouldReload, setShouldReload] = useState(false);

  /* useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!shouldReload) {
        event.preventDefault();
        setShowModal(true);
        // This is necessary to show the modal and prevent the default reload behavior
        event.returnValue = ''; 
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [shouldReload]);

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleReload = () => {
    setShouldReload(true);
    setShowModal(false);
    window.removeEventListener('beforeunload', () => {}); // Remove the event listener to allow reload
    window.location.reload();
  }; */

  return (
    <div>
      <h1>Your Page Content</h1>
      {/* Other content */}
      {/* <ReloadModal
        showModal={showModal}
        handleCancel={handleCancel}
        handleReload={handleReload}
      /> */}
    </div>
  );
};
