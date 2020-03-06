<template>
    <div class="Sound" v-on:click.prevent="playing = !playing" v-bind:class="{ playing: playing }">
        <div class="cover" >
            <img class="cover-image" :src="cover" alt="">
            <svg
            class="progress-ring"
            viewBox="0 0 150 150">
            <circle
                class="progress-ring__circle"
                stroke="#FF00FF"
                stroke-width="6"
                fill="transparent"
                cx="75" cy="75" r="72"
                stroke-linecap="round"
                :stroke-dasharray="circumference + ' ' + circumference"
                :stroke-dashoffset="strokeDashoffset"/>
            </svg>
        </div>
        <div class="controls">
            <input v-on:click.stop class="sound-slider" v-model.lazy.number="volume" type="range" min="0" max="100"/>
        </div>
        <audio :loop="innerLoop" ref="audiofile" :src="file" preload="auto" style="display: none;"></audio>
    </div>
</template>

<script>
const convertTimeHHMMSS = (val) => {
    let hhmmss = new Date(val * 1000).toISOString().substr(11, 8);
    return hhmmss.indexOf("00:") === 0 ? hhmmss.substr(3) : hhmmss;
};

export default {
  name: 'Sound',
  props: {
        file: {
            type: String,
            default: null
        },
        autoPlay: {
            type: Boolean,
            default: false
        },
        loop: {
            type: Boolean,
            default: false
        },
        cover: {
            type: String,
            default: null
        }
    },
    data: () => ({
        audio: undefined,
        currentSeconds: 0,
        durationSeconds: 0,
        innerLoop: false,
        loaded: false,
        playing: false,
        previousVolume: 35,
        volume: 100,
        radius: 0,
        circumference: 0,
    }),
    computed: {
        currentTime() {
            return convertTimeHHMMSS(this.currentSeconds);
        },
        durationTime() {
            return convertTimeHHMMSS(this.durationSeconds);
        },
        percentComplete() {
            return parseInt(this.currentSeconds / this.durationSeconds * 100);
        },
        strokeDashoffset() {
            return this.circumference - this.percentComplete / 100 * this.circumference;
        }
    },
    watch: {
        playing(value) {
            if (value) { return this.audio.play(); }
            this.audio.pause();
        },
        volume() {
            this.audio.volume = this.volume / 100;
        }
    },
    methods: {
        load() {
            if (this.audio.readyState >= 2) {
                this.loaded = true;
                this.durationSeconds = parseInt(this.audio.duration);
                return this.playing = this.autoPlay;
            }

            throw new Error('Failed to load sound file.');
        },
        seek(e) {
            if (!this.playing || e.target.tagName === 'SPAN') {
                return;
            }
            
            const el = e.target.getBoundingClientRect();
            const seekPos = (e.clientX - el.left) / el.width;

            this.audio.currentTime = parseInt(this.audio.duration * seekPos);
        },
        update() {
            this.currentSeconds = parseInt(this.audio.currentTime);
        }
    },
    created() {
        this.innerLoop = this.loop;
    },
    mounted() {
        this.audio = this.$el.querySelectorAll('audio')[0];
        this.audio.addEventListener('timeupdate', this.update);
        this.audio.addEventListener('loadeddata', this.load);
        this.audio.addEventListener('pause', () => {
            this.playing = false;
            this.audio.currentTime = 0;
        });
        this.audio.addEventListener('play', () => { this.playing = true; });

        let circle = document.querySelector('circle');
        let radius = circle.r.baseVal.value;
        this.circumference = radius * 2 * Math.PI;
    }
}
</script>

<style lang="scss" scoped>
.Sound {
    border-radius: 1rem;
    padding: 1rem;
    transition: background-color 0.3s;
    .cover {
        height: 150px;
        width: 150px;
        box-shadow: 5px 5px #000000;
        border-radius: 100%;
        box-shadow: 0 0 0 6px #193043 inset;
        position: relative;
        .cover-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
        }
        .progress-ring__circle {
            transition: 0.2s stroke-dashoffset;
            // axis compensation
            transform: rotate(-90deg);
            transform-origin: 50% 50%;
        }
    }
    .controls {
        width: 100%;
        padding: 1rem 0 0.5rem 0;
        .sound-slider {
            -webkit-appearance: none;  /* Override default CSS styles */
            appearance: none;
            width: 100%; /* Full-width */
            height: 6px; /* Specified height */
            background: #193043; /* Grey background */
            outline: none; /* Remove outline */
            opacity: 1; /* Set transparency (for mouse-over effects on hover) */
            border-radius: 1rem;
            &::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 20px;
                height: 20px;
                background-color: #193043;
                cursor: pointer;
                border-radius: 3rem;
                border: 0;
                transition: background-color 0.3s;
            }
            &::-moz-range-thumb {
                width: 20px;
                height: 20px;
                background-color: #193043;
                cursor: pointer;
                border-radius: 3rem;
                border: 0;
                transition: background-color 0.3s;
            }
        }
    }
    &.playing {
        background-color: #091119;
        .controls {
            .sound-slider {
                &::-webkit-slider-thumb {
                    background-color: #FF00FF;
                }
                &::-moz-range-thumb {
                    background-color: #FF00FF;
                }
            }
        }
    }
}
</style>
