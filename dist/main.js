
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playlist = $(".wrapper-song");
const cd = $(".cd");
const player = $(".control-play");
const audio = $("#audio");
const cd_thumb = $(".cd-thumb");
const nameSong = $(".name-song");
const progress = $(".progress");
const nextSong = $(".next i");
const preNextSong = $(".pre-next i");
const random = $(".random i");
const repeat = $(".repeat i");


const app = {
    currentIndex: 0,
    isPlaying: true,
    indexSong: 0,
    isRandom: false,
    isRepeat: false,
    path: "",
    pathCd: "",
    api: [
        {
            name: 'Thủ Đô Cyber',
            singer: 'RPT Orijinn, LOW G, RZMas, RPT MCK',
            image: './assets/images/artworks-acvKs7r8sVX92gpE-OyXAYQ-t500x500.jpg',
            song: './assets/songs/ThuDoCypher-RPTMCKOrijinnRzMaLowG-6678270.mp3'
        },
        {
            name: 'So close',
            singer: 'BinZ vs Phương Ly',
            image: './assets/images/so-close.jpg',
            song: './assets/songs/SoClose-BinzPhuongLy-6057836.mp3'
        },
        {
            name: 'Hết Duyên',
            singer: 'NIT X TĂNG DUY TÂN',
            image: './assets/images/het-duyen.jpg',
            song: './assets/songs/HetDuyenDoNguoiKia-NITTangDuyTan-5488521.mp3'
        },
        {
            name: 'Người Mua Vui',
            singer: 'Lil Shady',
            image: './assets/images/nguoi-mua-vui.jpg',
            song: './assets/songs/NguoiMuaVui-LilShadyLEG-3031805.mp3'
        },
        {
            name: 'Siêu Sao',
            singer: 'Lil Shady if Kyo',
            image: './assets/images/sieu-sao.jpg',
            song: './assets/songs/SieuSao-LilShadyKyo-3789419.mp3'
        },
        {
            name: 'Ý Niệm',
            singer: 'Kyo vs Zenky',
            image: './assets/images/y-niem.jpg',
            song: './assets/songs/YNiem-KYO-Zenky_34jsy_hq.mp3'
        },
        {
            name: 'So far',
            singer: 'BinZ',
            image: './assets/images/so-far.jpg',
            song: './assets/songs/SoFar-Binz-5521790.mp3'
        }
    ],
    render() {
        var html = this.api.map((item, index) => {
            return `<div class="song ${index === this.currentIndex ? 'active' : ''}">
            <div class="img-song">
            <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="description-song">
            <h3>${item.name}</h3>
            <span>${item.singer}</span>
            </div>
            <div class="options">
            <i class="fas fa-ellipsis-h"></i>
            </div>
            </div>`
        })
        playlist.innerHTML = html.join('');
    },


    handleEvent() {
        const _this = app;
        const songs = $$('.song');

        // Xử lý scroll
        const cdWidth = cd.offsetWidth;
        document.onscroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newWidth = (cdWidth - scrollTop);
            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0
            cd.style.opacity = newWidth / cdWidth
        };

        // Xử lý cd quay/dừng
        const cdAnimation = cd.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdAnimation.pause()

        // Xử lý click list song
        songs.forEach((song, i) => {
            song.onclick = () => {
                if (_this.isPlaying === false) {
                    $('.song.active').classList.remove('active');
                    song.classList.add('active');
                    cdAnimation.play();
                    player.classList.add('playing');
                    this.handleSong(i);
                    this.indexSong = i;
                    audio.play();
                } else {
                    $('.song.active').classList.remove('active');
                    song.classList.add('active');
                    cdAnimation.pause();
                    player.classList.remove('playing');
                    _this.isPlaying = true;
                    this.handleSong(i);
                    this.indexSong = i;
                }
            }
        });

        // Xử lý bật/dừng nhạc
        player.onclick = () => {
            if (_this.isPlaying) {
                audio.play()
                cdAnimation.play()
                player.classList.add('playing')
                return _this.isPlaying = false;
            } else {
                audio.pause()
                cdAnimation.pause()
                player.classList.remove('playing')
                return _this.isPlaying = true;
            }
        };


        // Xử lý next
        handleNext = () => {
            if (_this.isPlaying) {
                this.indexSong++;
                this.handleSong(this.indexSong);
            } else {
                this.indexSong++;
                this.handleSong(this.indexSong);
                player.classList.add('playing')
                cdAnimation.play()
                audio.play();
            }
        }

        handlePreNext = () => {
            if (_this.isPlaying) {
                this.indexSong--;
                this.handleSong(this.indexSong);
            } else {
                this.indexSong--;
                this.handleSong(this.indexSong);
                player.classList.add('playing');
                cdAnimation.play();
                audio.play();
            }
        }

        // Click chuyển bài
        nextSong.onclick = () => {
            if (this.indexSong + 1 > this.api.length - 1) {
                this.indexSong = -1;
            }
            handleNext()
        }

        preNextSong.onclick = () => {
            if (this.indexSong < 1) {
                this.indexSong = this.api.length;
            }
            handlePreNext()
        }

        // Xử lý play random
        random.onclick = () => {
            random.classList.toggle('active');
            this.isRandom = !this.isRandom;
        }

        // Xử lý play repeat
        repeat.onclick = () => {
            repeat.classList.toggle('active');
            this.isRepeat = !this.isRepeat;
        }

        // Xử lý khi âm thanh kết thúc
        audio.onended = () => {
            if (this.indexSong < this.api.length - 1) {
                cdAnimation.pause()
                player.classList.remove('playing')
                handleNext()
            } else if (this.isRepeat) {
                this.indexSong = 0;
                this.handleSong(this.indexSong);
                audio.play()
                cdAnimation.play()
            } else {
                this.handleSong(0);
                audio.pause()
                cdAnimation.pause()
                player.classList.remove('playing');
                this.indexSong = 0;
            }
        }

    },


    // Hàm set song music
    handleSong(index) {
        if (this.isRandom) {
            const num = this.api.length - 1;
            const numRandom = Math.random() * (num - 0)
            index = numRandom.toFixed()
        }
        const songs = $$('.song');
        $('.song.active').classList.remove('active');
        songs[index].classList.add('active')
        audio.setAttribute('src', this.path[index].pathSong);
        cd_thumb.style.backgroundImage = `url(${this.path[index].pathCd})`;
        nameSong.innerText = this.path[index].nameSong;
        progress.value = 0;
    },

    // Đường dẫn 
    handlePath() {
        var path = this.api.map((item, i) => {
            return path = {
                pathSong: item.song,
                pathCd: item.image,
                nameSong: item.name,
            }
        })
        audio.setAttribute('src', path[0].pathSong);
        cd_thumb.style.backgroundImage = `url(${path[0].pathCd})`;
        nameSong.innerText = path[0].nameSong;
        return this.path = path;
    },

    // Xử lý timeline
    hanldeTimeUpdate() {
        audio.ontimeupdate = () => {
            if (audio.duration) {
                const timeSong = (audio.currentTime / audio.duration) * 100;
                progress.value = Math.floor(timeSong)
            }
        }
        progress.onchange = (e) => {
            audio.currentTime = (audio.duration / 100) * e.target.value;
        }

    },


    start() {
        this.render();
        this.handleEvent();
        this.handlePath();
        this.hanldeTimeUpdate();
    }

}


app.start()
