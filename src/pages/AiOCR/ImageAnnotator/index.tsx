import React, { useRef, useEffect, useCallback, useState } from 'react';
import styles from './index.less';

interface Location {
    left: number;
    top: number;
    width: number;
    height: number;
}

interface Annotation {
    location: Location;
    words: string;
}

interface ImageAnnotatorProps {
    imageSrc: string;
    annotations: Annotation[];
    isMark: boolean;
    isBlue: boolean;
    angle: number;
    scale: number;
}

const ImageAnnotator: React.FC<ImageAnnotatorProps> = ({ imageSrc, annotations, isMark, isBlue, angle, scale }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [mouseStart, setMouseStart] = useState({ x: 0, y: 0 });
    const [imgStart, setImgStart] = useState({ x: 0, y: 0 });

    useEffect(() => {
        return () => {
            if (canvasRef.current) {
                const ctx = canvasRef.current.getContext('2d');
                if (ctx) {
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                }
            }
        };
    }, []);

    useEffect(() => {
        if (imgRef.current) {
            imgRef.current.style.transform = `scale(${scale})`;
        }
    }, [scale]);

    const handleMouseDown = (event: any) => {
        setIsDragging(true);
        setMouseStart({ x: event.clientX, y: event.clientY });
        const rect = imgRef.current.getBoundingClientRect();
        setImgStart({ x: rect.left, y: rect.top });
    };

    const handleMouseMove = (event: any) => {
        if (!isDragging) return;
        const dx = event.clientX - mouseStart.x;
        const dy = event.clientY - mouseStart.y;
        const newLeft = imgStart.x + dx;
        const newTop = imgStart.y + dy;
        imgRef.current.style.transform = `translate(${newLeft}px, ${newTop}px) scale(${scale})`;
        if (canvasRef.current) {
            canvasRef.current.style.transform = `translate(${newLeft}px, ${newTop}px) scale(${scale})`;
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        drawAnnotations(); // 重新绘制注释
    };

    const drawAnnotations = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        annotations.forEach(annotation => {
            const { location, words } = annotation;

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
            ctx.arc((location.left + 2) * scale, (location.top + 2) * scale, 2 * scale, Math.PI, Math.PI * 3 / 2, false);
            ctx.arc((location.left + location.width - 2) * scale, (location.top + 2) * scale, 2 * scale, Math.PI * 3 / 2, 2 * Math.PI, false);
            ctx.arc((location.left + location.width - 2) * scale, (location.top + location.height - 2) * scale, 2 * scale, 0, Math.PI / 2, false);
            ctx.arc((location.left + 2) * scale, (location.top + location.height - 2) * scale, 2 * scale, Math.PI / 2, Math.PI, false);
            ctx.closePath();
            ctx.fill();

            if (isBlue) {
                ctx.stroke();
            }

            // 绘制文字
            ctx.fillStyle = 'black';
            ctx.font = `${14 * scale}px DFPHaiBaoW12`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(words, (location.left + location.width / 2) * scale, (location.top + location.height / 2) * scale);
        });
    }, [annotations, isMark, isBlue, scale]);

    useEffect(() => {
        if (imgRef.current && canvasRef.current) {
            imgRef.current.style.transform = `rotate(${angle}deg) scale(${scale})`;
            const canvas = canvasRef.current;
            const img = imgRef.current;

            canvas.width = img.naturalWidth * scale;
            canvas.height = img.naturalHeight * scale;
            canvas.style.transform = `rotate(${angle}deg) scale(${scale})`;

            drawAnnotations();
        }
    }, [angle, scale, drawAnnotations]);

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
        <div className={styles.annotator}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}>
            <img ref={imgRef} src={imageSrc} alt="Annotated" className={styles.img} />
            {(isMark || isBlue) && (
                <canvas ref={canvasRef} className={styles.canvas} />
            )}
        </div>
    );
};

export default ImageAnnotator;