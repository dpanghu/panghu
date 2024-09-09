import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './index.less';

interface Vertex {
    x: number;
    y: number;
}

interface Annotation {
    number: string;
    vertexes_location: Vertex[];
}

interface ImageAnnotatorProps {
    imageSrc: string;
    annotations: Annotation[];
    isMark?: boolean;
    isBlue?: boolean;
    angle?: number;
    scale: number;
    disabled?: boolean;
}
const DraggableCanvas: React.FC<ImageAnnotatorProps> = ({
    imageSrc,
    annotations,
    isMark = false,
    isBlue = false,
    angle = 0,
    scale,
    disabled = false,
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [mouseStart, setMouseStart] = useState({ x: 0, y: 0 });
    const [imgStart, setImgStart] = useState({ x: 0, y: 0 });
    const imgContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        return () => {
            if (canvasRef.current) {
                const ctx = canvasRef.current.getContext('2d');
                if (ctx) {
                    ctx.clearRect(
                        0,
                        0,
                        canvasRef.current.width,
                        canvasRef.current.height,
                    );
                }
            }
        };
    }, []);
    useEffect(() => {
        if (imgRef.current) {
            imgRef.current.style.transform = `scale(${scale})`;
        }
    }, [scale]);

    // 图片的上下左右位置不可超出容器上下左右的位置减去100px
    const isOverBoundary = (dx, dy, imgX, imgY) => {
        const gap = 100;
        const containerRect = imgContainerRef.current?.getBoundingClientRect();
        if (!containerRect) return false;
        const containerTop = containerRect.top;
        const containerLeft = containerRect.left;
        const containerRight = containerRect.left + containerRect.width;
        const containerBottom = containerRect.top + containerRect.height;
        const imgRect = imgRef.current?.getBoundingClientRect();
        if (!imgRect) return false;
        const imgTop = imgRect.top;
        const imgLeft = imgRect.left;
        const imgRight = imgRect.left + imgRect.width;
        const imgBottom = imgRect.top + imgRect.height;
        console.log(imgTop, imgLeft);
        let stopY = false;
        let stopX = false;
        const translateMatch = imgRef.current.style.transform.match(
            /translate\((-?\d+)px, (-?\d+)px\)/,
        );
        let currentLeft = translateMatch ? parseInt(translateMatch[1], 10) : 0;
        let currentTop = translateMatch ? parseInt(translateMatch[2], 10) : 0;
        if (imgTop + gap > containerBottom || imgBottom - gap < containerTop) {
            stopY = true;
            console.log('tttt');
        } else {
            stopY = false;
            console.log('fff');
        }
        if (imgLeft + gap > containerRight || imgRight - gap < containerLeft) {
            stopX = true;
        } else {
            stopX = false;
        }

        return {
            newLeft: stopX ? currentLeft : imgX + dx,
            newTop: stopY ? currentTop : imgY + dy,
        };
    };

    const handleMouseDown = (event: React.MouseEvent) => {
        event.preventDefault(); // 阻止默认的图片拖拽行为
        if (disabled) return
        if (scale > 1) {
            // 只有放大时才能拖拽
            setIsDragging(true);
            setMouseStart({ x: event.clientX, y: event.clientY });
            const currentTransform = imgRef.current.style.transform;
            const translateMatch = currentTransform.match(
                /translate\((-?\d+)px, (-?\d+)px\)/,
            );
            const currentLeft = translateMatch ? parseInt(translateMatch[1], 10) : 0;
            const currentTop = translateMatch ? parseInt(translateMatch[2], 10) : 0;
            setImgStart({ x: currentLeft, y: currentTop });
        }
    };
    const handleMouseMove = (event: React.MouseEvent) => {
        if (disabled) return
        if (!isDragging) return;
        event.preventDefault(); // 阻止默认的图片拖拽行为
        const dx = event.clientX - mouseStart.x;
        const dy = event.clientY - mouseStart.y;
        const newLeft = imgStart.x + dx;
        const newTop = imgStart.y + dy;
        imgRef.current.style.transform = `translate(${newLeft}px, ${newTop}px) rotate(${angle}deg) scale(${scale})`;
        if (canvasRef.current) {
            canvasRef.current.style.transform = `translate(${newLeft}px, ${newTop}px) rotate(${angle}deg) scale(${scale})`;
        }
    };
    const handleMouseUp = (event: React.MouseEvent) => {
        if (disabled) return
        setIsDragging(false);
        event.preventDefault();
        drawAnnotations(); // 重新绘制注释
    };

    const drawAnnotations = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        annotations.forEach((annotation) => {
            const { number, vertexes_location } = annotation;

            // 设置背景颜色
            if (isMark && isBlue) {
                ctx.fillStyle = 'white';
                ctx.strokeStyle = '#5A73FF';
                ctx.lineWidth = 1;
            } else if (isMark) {
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'transparent';
            } else if (isBlue) {
                ctx.fillStyle = 'rgba(90,115,255,0.34)';
                ctx.strokeStyle = '#5A73FF';
                ctx.lineWidth = 1;
            } else {
                ctx.fillStyle = 'transparent';
                ctx.strokeStyle = 'transparent';
            }

            // 绘制背景
            ctx.beginPath();
            ctx.moveTo(vertexes_location[0].x * scale, vertexes_location[0].y * scale);
            for (let i = 1; i < vertexes_location.length; i++) {
                ctx.lineTo(vertexes_location[i].x * scale, vertexes_location[i].y * scale);
            }
            ctx.closePath();
            ctx.fill();

            if (isBlue) {
                ctx.stroke();
            }
            if (isMark) {
                // 绘制文字
                ctx.fillStyle = 'black';
                ctx.font = `${14 * scale}px DFPHaiBaoW12`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(number, (vertexes_location[0].x * scale + vertexes_location[2].x * scale) / 2, (vertexes_location[0].y * scale + vertexes_location[2].y * scale) / 2);
            }
        });
    }, [annotations, isMark, isBlue, scale]);

    useEffect(() => {
        if (imgRef.current) {
            imgRef.current.style.transform = `rotate(${angle}deg) scale(${scale})`;
        }
        if (canvasRef.current && (isMark || isBlue)) {
            const canvas = canvasRef.current;
            const img = imgRef.current;
            const currentTransform = img.style.transform;
            const translateMatch = currentTransform.match(
                /translate\((-?\d+)px, (-?\d+)px\)/,
            );
            const currentLeft = translateMatch ? parseInt(translateMatch[1], 10) : 0;
            const currentTop = translateMatch ? parseInt(translateMatch[2], 10) : 0;
            setImgStart({ x: currentLeft, y: currentTop });

            canvas.width = img.naturalWidth * scale;
            canvas.height = img.naturalHeight * scale;
            canvas.style.transform = `rotate(${angle}deg) scale(${scale})`;

            drawAnnotations();
        }
    }, [angle, scale, drawAnnotations, isMark, isBlue]);

    useEffect(() => {
        if (!canvasRef.current || !imgRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = imgRef.current;

        img.onload = () => {
            canvas.width = img.naturalWidth * scale;
            canvas.height = img.naturalHeight * scale;
            ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
            drawAnnotations();
        };
        img.src = imageSrc;
    }, [imageSrc, scale, drawAnnotations]);

    return (
        <div
            ref={imgContainerRef}
            className={styles.annotator}
            style={{ cursor: scale > 1 && !disabled ? 'grab' : 'default' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <img ref={imgRef} src={imageSrc} alt="Annotated" className={styles.img} />
            {(isMark || isBlue) && (
                <canvas ref={canvasRef} className={styles.canvas} />
            )}
        </div>
    );
};

export default DraggableCanvas;
