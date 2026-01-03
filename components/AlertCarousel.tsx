'use client';

import React, { useState } from 'react';
import AlertCard from './AlertCard';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { markAlertAsRead } from '@/store/slices/alertSlice';

interface AlertCarouselProps {
  onClose?: () => void;
}

const AlertCarousel = ({ onClose }: AlertCarouselProps) => {
  const dispatch = useDispatch();
  const alerts = useSelector((state: RootState) => state.alerts.alerts);
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = alerts[currentIndex];
  if (!current) return null;

  const handleClose = () => {
    if (!current.isRead) {
      dispatch(markAlertAsRead(currentIndex));
    }
    onClose?.();
  };
  const handleNext = () => {
    if (!current.isRead) {
      dispatch(markAlertAsRead(currentIndex));
    }
    setCurrentIndex((prev) => Math.min(prev + 1, alerts.length - 1));
  };
  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };
  return (
    <div className="whitespace-pre-line transition-opacity duration-300 ease-in-out opacity-100 ">
      <AlertCard
        title={current.title}
        content={current.content}
        isRead={current.isRead}
        onLeftClick={currentIndex > 0 ? handlePrev : undefined}
        onRightClick={currentIndex < alerts.length - 1 ? handleNext : undefined}
        onClose={handleClose}
      />
    </div>
  );
};

export default AlertCarousel;
