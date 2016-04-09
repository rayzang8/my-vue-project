<template>
    <div class="loading-screen-mask">
        <div class='loading-screen'>
            <img src='' class='v-image'/>
            <canvas class='v-cvs' width='120' height='120'></canvas>
        </div>
    </div>
</template>
<style src="../assets/css/style-mask.css"></style>

<script>
    let rotating = null;
    export default {
        ready: function () {
            let step = 0;
            let bg = document.querySelector('.v-cvs');
            let ctx = bg.getContext('2d');
            let imd = null;
            let circ = Math.PI * 2;
            let quart = Math.PI / 2;
            let lineColor = '#f10582';
            let backforward = false;
            ctx.clearRect(0, 0, 120, 120);
            ctx.beginPath();
            ctx.strokeStyle = lineColor;
            ctx.lineCap = 'square';
            ctx.closePath();
            ctx.fill();
            ctx.lineWidth = 2.8;
            imd = ctx.getImageData(0, 0, 120, 120);
            let draw = function (current) {
                ctx.putImageData(imd, 0, 0);
                ctx.beginPath();
                ctx.arc(60, 60, 49, -(quart), ((circ) * current) - quart, backforward);
                ctx.stroke();
            };

            function stepDraw () {
                step += 0.01;
                draw(step);
                if (step >= 0.99) {
                    step = 0;
                    if (!backforward) {
                        backforward = true;
                    } else {
                        backforward = false;
                    }
                }
            }

            rotating = setInterval(stepDraw, 10);
        },
        destoryed: function () {
            clearInterval(rotating)
        }
    }
</script>
