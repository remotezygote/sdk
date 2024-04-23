import * as React from "react";

import { VideoCell } from "../VideoCell";

import { Bounds, Box, CalculateLayoutResult, Frame, Origin, hasBounds, makeBox, makeFrame } from "@whereby.com/core";

function generateStylesFromFrame({ origin, bounds }: { origin: Origin; bounds: Bounds }) {
    return {
        top: Math.round(origin.top),
        left: Math.round(origin.left),
        height: Math.round(bounds.height),
        width: Math.round(bounds.width),
    };
}

interface RenderVideoCellProps {
    cell: {
        bounds: Bounds;
        aspectRatio: number;
    };
    child: React.ReactElement;
    className?: string;
    clientId: string;
    style?: React.CSSProperties;
    withRoundedCorners?: boolean;
    withShadow?: boolean;
}

function renderVideoCell({
    cell,
    child,
    clientId,
    style = {},
    withRoundedCorners = false,
    withShadow = false,
}: RenderVideoCellProps) {
    const isHidden = !hasBounds(cell.bounds);
    return (
        <VideoCell
            width={cell.bounds.width}
            height={cell.bounds.height}
            aspectRatio={cell.aspectRatio}
            style={isHidden ? { width: 0, height: 0 } : style}
            withRoundedCorners={withRoundedCorners}
            withShadow={withShadow}
            key={clientId}
        >
            {child}
        </VideoCell>
    );
}

interface RenderVideoCellsProps {
    content: (React.JSX.Element | undefined)[];
    isConstrained: boolean;
    stageLayout: CalculateLayoutResult;
    withRoundedCorners: boolean;
    withShadow: boolean;
}

function renderPresentationGridVideoCells({
    content,
    isConstrained,
    stageLayout,
    withRoundedCorners,
    withShadow,
}: RenderVideoCellsProps) {
    const cells = stageLayout.presentationGrid.cells;
    return content.map((child, index) => {
        const cell = cells[index];
        const origin = {
            top: stageLayout.presentationGrid.origin.top + stageLayout.presentationGrid.paddings.top + cell.origin.top,
            left:
                stageLayout.presentationGrid.origin.left +
                stageLayout.presentationGrid.paddings.left +
                cell.origin.left,
        };
        const style = {
            width: Math.round(cell.bounds.width),
            height: Math.round(cell.bounds.height),
            transform: `translate3d(${Math.round(origin.left)}px, ${Math.round(origin.top)}px, 0)`,
        };
        const clientId = child?.props.participant.id;
        const childWithProps = React.cloneElement(child!, {
            isSmallCell: cell.isSmallCell,
            isZoomedByDefault: !!isConstrained && !child?.props.participant.isPresentation,
            canZoom: !!isConstrained,
            key: clientId,
        });

        return renderVideoCell({
            cell,
            child: childWithProps,
            clientId,
            style,
            withRoundedCorners,
            withShadow,
        });
    });
}

function renderGridVideoCells({
    content,
    isConstrained,
    stageLayout,
    withRoundedCorners,
    withShadow,
}: RenderVideoCellsProps) {
    const cells = stageLayout.videoGrid.cells;
    const gridVideoCells = content.map((child, index) => {
        const cell = cells[index];
        const origin = {
            top: stageLayout.videoGrid.origin.top + stageLayout.videoGrid.paddings.top + cell.origin.top,
            left: stageLayout.videoGrid.origin.left + stageLayout.videoGrid.paddings.left + cell.origin.left,
        };
        const style = {
            width: Math.round(cell.bounds.width),
            height: Math.round(cell.bounds.height),
            transform: `translate3d(${Math.round(origin.left)}px, ${Math.round(origin.top)}px, 0)`,
        };

        const clientId = child?.props.participant.id;
        const childWithProps = React.cloneElement(child!, {
            isSmallCell: cell.isSmallCell,
            isZoomedByDefault: !!isConstrained && !child?.props.participant.isPresentation,
            canZoom: !!isConstrained,
            key: clientId,
        });

        return renderVideoCell({
            cell,
            child: childWithProps,
            clientId,
            withRoundedCorners,
            style,
            withShadow,
        });
    });
    return gridVideoCells;
}

interface VideoStageLayoutProps {
    containerPaddings?: Box;
    debug?: boolean;
    featureRoundedCornersOff?: boolean;
    floatingContent?: React.ReactElement;
    frame?: Frame;
    gridContent?: (React.JSX.Element | undefined)[];
    hiddenGridContent?: React.ReactElement[];
    hiddenPresentationGridContent?: React.ReactElement[];
    isConstrained?: boolean;
    layoutOverflowBackdropFrame?: Frame;
    layoutVideoStage: CalculateLayoutResult;
    presentationGridContent?: (React.JSX.Element | undefined)[];
    subgridContent?: React.ReactElement[];
}

function VideoStageLayout({
    containerPaddings = makeBox(),
    debug = false,
    featureRoundedCornersOff = false,
    floatingContent,
    frame,
    gridContent = [],
    hiddenGridContent = [],
    hiddenPresentationGridContent = [],
    isConstrained = false,
    layoutOverflowBackdropFrame = makeFrame(),
    layoutVideoStage: stageLayout,
    presentationGridContent = [],
    subgridContent = [],
}: VideoStageLayoutProps) {
    const hasSupersizedContent = !!presentationGridContent.length;
    const hasVideoGridContent = !!gridContent.length;
    // const noneOnStage = !hasSupersizedContent && !hasVideoGridContent;
    const withRoundedCorners = !featureRoundedCornersOff && !isConstrained;

    // Build grid cells:
    const cells = [];

    // Grid:
    if (gridContent.length) {
        cells.push(
            ...renderGridVideoCells({
                content: gridContent,
                isConstrained,
                stageLayout,
                withRoundedCorners,
                withShadow: !isConstrained,
            }),
        );
    }
    // if (hiddenGridContent.length) {
    //     cells.push(...renderHiddenVideoCells({ content: hiddenGridContent }));
    // }
    // Supersized:
    if (presentationGridContent.length) {
        cells.push(
            ...renderPresentationGridVideoCells({
                content: presentationGridContent,
                isConstrained,
                stageLayout,
                withRoundedCorners,
                withShadow: !isConstrained,
            }),
        );
    }

    return (
        <div
            key={"video-stage-layout"}
            style={{
                width: "100%",
                height: "100%",
                position: "relative",
            }}
        >
            {hasBounds(layoutOverflowBackdropFrame.bounds) && (
                <div style={generateStylesFromFrame(layoutOverflowBackdropFrame)} />
            )}
            {cells}
            {debug && (
                <>
                    <div style={generateStylesFromFrame(stageLayout.presentationGrid)} />
                    <div style={generateStylesFromFrame(stageLayout.videoGrid)} />
                    {/* <div style={generateStylesFromFrame(stageLayout.subgrid)} /> */}
                </>
            )}
        </div>
    );
}

export { VideoStageLayout };
