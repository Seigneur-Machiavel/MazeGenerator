const EVENT_CLICK = 'click';

const drawingSurfaces = {
    canvas(config) {
        const {el} = config,
            ctx = el.getContext('2d');

        let magnification = 1, xOffset, yOffset;
        function xCoord(x) {
            return xOffset + x * magnification;
        }
        function invXCoord(x) {
            return (x - xOffset) / magnification;
        }
        function yCoord(y) {
            return yOffset + y * magnification;
        }
        function invYCoord(y) {
            return (y - yOffset) / magnification;
        }
        function distance(d) {
            return d * magnification;
        }

        return {
            clear() {
                ctx.clearRect(0, 0, el.width, el.height);
            },
            setSpaceRequirements(requiredWidth, requiredHeight, shapeSpecificLineWidthAdjustment = 1) {
                const {width,height} = el,
                    GLOBAL_LINE_WIDTH_ADJUSTMENT = 0.1,
                    verticalLineWidth = height * GLOBAL_LINE_WIDTH_ADJUSTMENT * shapeSpecificLineWidthAdjustment / requiredHeight,
                    horizontalLineWidth = width * GLOBAL_LINE_WIDTH_ADJUSTMENT * shapeSpecificLineWidthAdjustment / requiredWidth,
                    lineWidth = Math.min(verticalLineWidth, horizontalLineWidth);

                magnification = Math.min((width - lineWidth)/requiredWidth, (height - lineWidth)/requiredHeight);
                ctx.lineWidth = lineWidth;
                ctx.lineCap = 'round';
                xOffset = lineWidth / 2;
                yOffset = lineWidth / 2;
            },
            setColour(colour) {
                ctx.strokeStyle = colour;
                ctx.fillStyle = colour;
            },
            line(x1, y1, x2, y2, existingPath = false) {
                existingPath || ctx.beginPath();
                ctx.moveTo(xCoord(x1), yCoord(y1));
                ctx.lineTo(xCoord(x2), yCoord(y2));
                existingPath || ctx.stroke();
            },
            arc(cx, cy, r, startAngle, endAngle, counterclockwise = false, existingPath = false) {
                existingPath || ctx.beginPath();
                ctx.arc(xCoord(cx), yCoord(cy), distance(r), startAngle - Math.PI / 2, endAngle - Math.PI / 2, counterclockwise);
                existingPath || ctx.stroke();
            },
            fillPolygon(...xyPoints) {
                ctx.beginPath();
                xyPoints.forEach(({x,y}, i) => {
                    if (i) {
                        ctx.lineTo(xCoord(x), yCoord(y));
                    } else {
                        ctx.moveTo(xCoord(x), yCoord(y));
                    }
                });
                ctx.closePath();
                ctx.fill();
            },
            fillSegment(cx, cy, smallR, bigR, startAngle, endAngle) {
                const
                    innerStartX = cx + smallR * Math.sin(startAngle),
                    innerStartY = cy - smallR * Math.cos(startAngle),
                    innerEndX = cx + smallR * Math.sin(endAngle),
                    innerEndY = cy - smallR * Math.cos(endAngle),
                    outerStartX = cx + bigR * Math.sin(startAngle),
                    outerStartY = cy - bigR * Math.cos(startAngle),
                    outerEndX = cx + bigR * Math.sin(endAngle),
                    outerEndY = cy - bigR * Math.cos(endAngle);
                ctx.beginPath();
                this.line(innerStartX, innerStartY, outerStartX, outerStartY, true);
                this.arc(cx, cy, bigR, startAngle, endAngle, false, true);
                this.line(outerEndX, outerEndY, innerEndX, innerEndY, true);
                this.arc(cx, cy, smallR, endAngle, startAngle, true, true);
                ctx.closePath();
                ctx.fill();
            },
            convertCoords(x, y) {
                return [xCoord(x), yCoord(y)];
            },
        };
    },
    svg(config) {
        //const eventTarget = buildEventTarget('drawingSurfaces.svg'),
        const {el} = config,
            width = Number(el.node.getAttribute('width')),
            height = Number(el.node.getAttribute('height'));

        let magnification = 1, colour='black', lineWidth, xOffset, yOffset;
        function xCoord(x) {
            return xOffset + x * magnification;
        }
        function invXCoord(x) {
            return (x - xOffset) / magnification;
        }
        function yCoord(y) {
            return yOffset + y * magnification;
        }
        function invYCoord(y) {
            return (y - yOffset) / magnification;
        }
        function distance(d) {
            return d * magnification;
        }

        function polarToXy(cx, cy, d, angle) {
            return [xCoord(cx + d * Math.sin(angle)), yCoord(cy - d * Math.cos(angle))];
        }

        return {
            clear() {
                el.innerHTML = '';
            },
            setSpaceRequirements(requiredWidth, requiredHeight, shapeSpecificLineWidthAdjustment = 1) {
                const GLOBAL_LINE_WIDTH_ADJUSTMENT = 0.1,
                    verticalLineWidth = height * GLOBAL_LINE_WIDTH_ADJUSTMENT * shapeSpecificLineWidthAdjustment / requiredHeight,
                    horizontalLineWidth = width * GLOBAL_LINE_WIDTH_ADJUSTMENT * shapeSpecificLineWidthAdjustment / requiredWidth;

                lineWidth = Math.min(verticalLineWidth, horizontalLineWidth);
                magnification = Math.min((width - lineWidth)/requiredWidth, (height - lineWidth)/requiredHeight);
                xOffset = lineWidth / 2;
                yOffset = lineWidth / 2;

            },
            setColour(newColour) {
                colour = newColour;
            },
            line(x1, y1, x2, y2) {
                const line = el.line(xCoord(x1), yCoord(y1), xCoord(x2), yCoord(y2)).stroke({color: colour, width: lineWidth, linecap: 'round'});
            },
            fillPolygon(...xyPoints) {
                const polygon = el.polygon(...xyPoints.map(({x,y}) => [xCoord(x), yCoord(y)]) ).fill(colour);
            },
            fillSegment(cx, cy, smallR, bigR, startAngle, endAngle) {
                const isCircle = (endAngle - startAngle === Math.PI * 2);

                if (isCircle) {
                    const circle = el.circle(distance(bigR - smallR)).move(xCoord(cx) - distance(bigR - smallR), yCoord(cy) - distance(bigR - smallR)).fill(colour);
                } else {
                    const [innerStartX, innerStartY] = polarToXy(cx, cy, smallR, startAngle),
                        [innerEndX, innerEndY] = polarToXy(cx, cy, smallR, endAngle),
                        [outerStartX, outerStartY] = polarToXy(cx, cy, bigR, startAngle),
                        [outerEndX, outerEndY] = polarToXy(cx, cy, bigR, endAngle),
                        isLargeArc = endAngle - startAngle > Math.PI / 2,
                        d = `        
                            M ${innerStartX} ${innerStartY} ${outerStartX} ${outerStartY}
                            A ${distance(bigR)} ${distance(bigR)} 0 ${isLargeArc ? "1" : "0"} 1 ${outerEndX} ${outerEndY}
                            L ${innerEndX} ${innerEndY}
                            A ${distance(smallR)} ${distance(smallR)} 0 ${isLargeArc ? "1" : "0"} 0 ${innerStartX} ${innerStartY}`;
                    
                    const path = el.path(d).fill(colour);
                }
            },
            arc(cx, cy, r, startAngle, endAngle) {
                const [startX, startY] = polarToXy(cx, cy, r, startAngle),
                    [endX, endY] = polarToXy(cx, cy, r, endAngle),
                    radius = distance(r),
                    isLargeArc = endAngle - startAngle > Math.PI/2,
                    d = `M ${startX} ${startY} A ${radius} ${radius} 0 ${isLargeArc ? "1" : "0"} 1 ${endX} ${endY}`;

                const path = el.path(d).fill('none').stroke({color: colour, width: lineWidth, linecap: 'round'});
            },
            convertCoords(x, y) {
                return [xCoord(x), yCoord(y)];
            },
        };
    }
}

module.exports = {
    EVENT_CLICK,
    drawingSurfaces
}