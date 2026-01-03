"use client";

import React from "react";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CloseIcon } from "@/components/svgs/CloseIcon";
import { ChevronLeftIcon } from "@/components/svgs/ChevronLeftIcon";
import { ChevronRightIcon } from "@/components/svgs/ChevronRightIcon";


export interface AlertCardProps {
    title: string;
    content: string;
    actionText?: string;
    onActionClick?: () => void;
    onLeftClick?: () => void;
    onRightClick?: () => void;
    isRead?: boolean;
    onClose?: () => void;
}

const AlertCard = ({ title, content, actionText, onActionClick, onLeftClick, onRightClick, isRead = false, onClose }: AlertCardProps) => {

    return (
        <Card className="bg-primary-900 rounded-lg border-none shadow-none py-3 h-[170px] max-w-[240px] w-full mx-auto min-w-[240px]">
            <CardHeader className={cn("flex flex-row justify-between p-0 px-3 space-y-0", isRead ? "text-primary-400" : "text-secondary-50")}>
                <CardTitle className="flex items-center font-semibold text-xs">{title}</CardTitle>
                <div className="flex item-center  gap-[2px]">
                    <Button size="icon" variant="ghost" className="text-secondary-50 p-0 w-6 h-6" onClick={onLeftClick}
                        disabled={!onLeftClick} >
                        <ChevronLeftIcon className="w-4 h-4 text-primary-200" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-secondary-50 p-0 w-6 h-6" onClick={onRightClick}
                        disabled={!onRightClick}>
                        <ChevronRightIcon className="w-4 h-4 text-primary-200" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-secondary-50 p-0 w-6 h-6" onClick={onClose} >
                        <CloseIcon className="w-4 h-4" />
                    </Button>
                </div>

            </CardHeader>

            <CardContent className={cn("p-0 px-3 leading-relaxed whitespace-pre-wrap break-words", isRead ? "text-primary-400" : "text-secondary-50")}>

                <p className="font-normal text-xs w-full">
                    {content}
                </p>
            </CardContent>
            {actionText && <CardFooter className="flex px-3 py-2">
                <Button size="sm" className="bg-secondary-500 text-secondary-50 font-normal rounded-lg" onClick={onActionClick}>
                    {actionText}
                </Button>
            </CardFooter>}
        </Card>
    )
}

export default AlertCard
