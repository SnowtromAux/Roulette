class Helper{
    constructor(){}

    lightenColor(hex, percentage) {
        hex = hex.replace('#', '');
        
        let r = parseInt(hex.slice(0, 2), 16);
        let g = parseInt(hex.slice(2, 4), 16);
        let b = parseInt(hex.slice(4, 6), 16);
        
        r = Math.min(255, Math.floor(r + (255 - r) * percentage));
        g = Math.min(255, Math.floor(g + (255 - g) * percentage));
        b = Math.min(255, Math.floor(b + (255 - b) * percentage));
        
        let newHex = "#" + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
        
        return newHex;
    }

    darkenColor(hex, percentage) {
        hex = hex.replace('#', '');
        
        let r = parseInt(hex.slice(0, 2), 16);
        let g = parseInt(hex.slice(2, 4), 16);
        let b = parseInt(hex.slice(4, 6), 16);
        
        r = Math.max(0, Math.floor(r - r * percentage));
        g = Math.max(0, Math.floor(g - g * percentage));
        b = Math.max(0, Math.floor(b - b * percentage));
        
        let newHex = "#" + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
        
        return newHex;
    }

    circularPulseEffect(element, color1, color2, degrees , duration = 1000) {
        let startTime = null;

        function hexToRgb(hex) {
            const bigint = parseInt(hex.slice(1), 16);
            return {
                r: (bigint >> 16) & 255,
                g: (bigint >> 8) & 255,
                b: bigint & 255,
            };
        }

        function rgbToHex({ r, g, b }) {
            return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
        }

        const colorStart = hexToRgb(color1);
        const colorEnd = hexToRgb(color2);

        function animate(timestamp) {
            if (!startTime) startTime = timestamp;

            const elapsed = (timestamp - startTime) % duration;
            const progress = elapsed / duration;

            // Calculate the smooth oscillation using sine function
            const smoothProgress = 0.5 - 0.5 * Math.cos(progress * Math.PI * 2); // Oscillates between 0 and 1

            // Interpolate the RGB values based on smooth progress
            const r = Math.round(colorStart.r + (colorEnd.r - colorStart.r) * smoothProgress);
            const g = Math.round(colorStart.g + (colorEnd.g - colorStart.g) * smoothProgress);
            const b = Math.round(colorStart.b + (colorEnd.b - colorStart.b) * smoothProgress);

            const currentColor = rgbToHex({ r, g, b });
            element.style.background = `conic-gradient(${currentColor} 0deg, ${currentColor} ${degrees}deg, transparent ${degrees}deg, transparent)`;

            // Loop the animation
            requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
    }

    findElementsAround(arr, N, C) {
        const index = arr.indexOf(N);
        
        if (index === -1) {
            return { error: "Number not found in array" };
        }
        
        const totalLength = arr.length;
    
        // Get left elements, wrapping around if necessary
        const leftElements = [];
        for (let i = 1; i <= C; i++) {
            leftElements.push(arr[(index - i + totalLength) % totalLength]);
        }
    
        // Get right elements, wrapping around if necessary
        const rightElements = [];
        for (let i = 1; i <= C; i++) {
            rightElements.push(arr[(index + i) % totalLength]);
        }
    
        return [...leftElements.reverse(), N, ...rightElements];
    }   
}




class Device{
    constructor(){
        this.init();
    }

    init(){
        this.setupVariables();
        this.setupType();
        this.setupOrientation();
        this.setupOrientationChange();
        this.setupDeviceChange();
    }

    setupVariables(){
        this.type = 'pc';
        this.orientation = 'landscape';
    }

    setupType(){
        if(window.innerWidth <= 926)
            this.type = 'mobile';
    }

    setupOrientation(){
        if(window.innerWidth < window.innerHeight)
            this.orientation = 'portrait';
    }

    setupOrientationChange(){
        
    }

    setupDeviceChange(){
        window.addEventListener('resize' , () => {
            this.setupVariables();
            this.setupType();
            this.setupOrientation();
            console.log(this)
        })
    }
}


class BetButtons{
    constructor(){
        this.chip_positions_landscape = [
            {
                x: '-267.5%',
                y: '-85%'
            },
            {
                x: '-162.5%',
                y: '-115%'
            },
            {
                x: '-57.5%',
                y: '-135%'
            },
            {
                x: '57.5%',
                y: '-135%'
            },
            {
                x: '162.5%',
                y: '-115%'
            },
            {
                x: '267.5%',
                y: '-85%'
            }
        ]
        this.init();
    }


    init(){
        this.setupVariables();

        if(this.device.type === "mobile"){
            this.setupChipOpens();
            this.setupChipCloseBtn();
        }
    }

    setupVariables(){
        this.chip_buttons = document.querySelectorAll('.roulette-chip');
        this.device = new Device();
        this.cur_chip_index = 5;
        this.menu_opened = false;
    }

    setupChipOpens(){
        this.chip_buttons.forEach((chip_btn , index) => {
            chip_btn.addEventListener('click' , () => {
                this.triggerChip(chip_btn , index);
            });
        })
    }

    setupChipCloseBtn(){
        const close_btn = document.querySelector('.roulette-chip-puller');

        close_btn.addEventListener('click' , () => this.closeMenu());
    }
    
    triggerChip(clicked_chip_btn , index){
        this.menu_opened = !this.menu_opened
        if(this.menu_opened){
            this.chip_buttons.forEach((chip_button , index) => {
                if(this.device.type === 'mobile' && this.device.orientation === 'portrait'){
                    chip_button.style.transform = `translate(${this.chip_positions_landscape[index].x} , ${this.chip_positions_landscape[index].y}) rotate(90deg)`
                }else{
                    chip_button.style.transform = `translate(${this.chip_positions_landscape[index].x} , ${this.chip_positions_landscape[index].y})`
                }
                chip_button.style.zIndex = '1';
            })
        }else{
            this.cur_chip_index = index;
            clicked_chip_btn.style.zIndex = '2';

            this.closeMenu();
        }
    }

    closeMenu(){
        this.menu_opened = false;

        this.chip_buttons.forEach((chip_button) => {
            if(this.device.type === 'mobile' && this.device.orientation === 'portrait'){
                chip_button.style.transform = 'translate(0 , 0) rotate(90deg)';
            }else{
                chip_button.style.transform = 'translate(0 , 0)';
            }
        })
    }
}

class Buttons{
    constructor(){
        this.paytable_pinned = false;

        this.fullscreen_mode = false;
        this.normal_table_mode = true;
        
        this.burger_opened = false;
        this.init();
    }

    init(){
        this.setupExitBtn();
        this.setupPinBtn();
        this.setupFullScreenBtn();
        this.setupChangeTableBtn();
        this.setupMenuButton();
    }

    setupExitBtn(){
        const exit_btn = document.querySelector('.roulette-exit');

        exit_btn.addEventListener('click' , () => {            
            window.close();
        })
    }

    setupPinBtn(){
        this.paytable_opened = false;
        const pin_btn = document.querySelector('.roulette-pin');
        const paytable = document.querySelector('.roulette-paytable');

        console.log("wtf")
        pin_btn.addEventListener('click' , () => {
            this.paytable_opened = !this.paytable_opened;
            if(this.paytable_opened)
                paytable.classList.add('pinned');
            else
                paytable.classList.remove('pinned');
    
                this.paytable_pinned = !this.paytable_pinned;
            if(this.paytable_pinned)
                pin_btn.classList.add('pinned');
            else
                pin_btn.classList.remove('pinned');
        })

        pin_btn.addEventListener('mouseenter' , () => {
            if(window.innerWidth < 992)return;
            paytable.classList.add('pinned');
        })

        pin_btn.addEventListener('mouseleave' , () => {
            if(window.innerWidth < 992)return;
            if(this.paytable_pinned)return;
            paytable.classList.remove('pinned');
        })
    }

    setupFullScreenBtn(){
        const body = document.querySelector('body');
        const fullscreen_btn = document.querySelector('#fullscreen-btn');

        fullscreen_btn.addEventListener('click' , () => {
            this.fullscreen_mode = !this.fullscreen_mode;
            if(this.fullscreen_mode){
                if (body.requestFullscreen) {
                    body.requestFullscreen();
                } else if (body.webkitRequestFullscreen) { /* Safari */
                    body.webkitRequestFullscreen();
                } else if (body.msRequestFullscreen) { /* IE11 */
                    body.msRequestFullscreen();
                }
                
                fullscreen_btn.src = "../assets/btn-normalscreen.png";
            }else{
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) { /* Safari */
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) { /* IE11 */
                    document.msExitFullscreen();
                }

                fullscreen_btn.src = "../assets/btn-fullscreen.png";
            }
        });
    }

    setupChangeTableBtn(){
        const btn = document.querySelector('.roulette-change-table');

        btn.addEventListener('click' , () => {
            this.normal_table_mode = !this.normal_table_mode;

            const normal_table_el = document.querySelector('.roulette-normal-table-wrapper');
            const neighbour_table_el = document.querySelector('.roulette-neighbour-table-wrapper');

            const change_table_btn_img = btn.querySelector('img');

            if(this.normal_table_mode){
                normal_table_el.style.display = 'block';
                neighbour_table_el.style.display = 'none';
                change_table_btn_img.src = "../assets/button-neighbours-table.svg";
            }else{
                normal_table_el.style.display = 'none';
                neighbour_table_el.style.display = 'block';
                change_table_btn_img.src = "../assets/button-normal-table.svg";
            }
        })
    }

    setupMenuButton(){
        const menu_btn = document.querySelector('.roulette-burger-icon');
        const menu = document.querySelector('.roulette-dropdown-menu');

        menu_btn.addEventListener('click' , () => {
            this.burger_opened = !this.burger_opened;

            if(this.burger_opened)
                menu.classList.add('opened');
            else
                menu.classList.remove('opened');
        })
    }
}


class Screen{
    constructor(){
        this.init();
    }

    init(){
        this.resize();
        this.setupButtons();
        window.addEventListener('resize', this.resize);
    }

    resize(){
        const wrapper = document.querySelector('.roulette-wrapper');
        const body = document.querySelector('.roulette-body');
    
        const wrapper_w = wrapper.offsetWidth;
        const wrapper_h = wrapper.offsetHeight;
        const aspectRatio = wrapper_w / wrapper_h;
            
        if (window.matchMedia("(max-device-width: 926px)").matches && window.matchMedia("(orientation: portrait)").matches){
            if (aspectRatio > 9 / 16) {
                body.style.transform = `scale(${wrapper_h / 1280})`;
            } else {
                body.style.transform = `scale(${wrapper_w / 720})`;
            }
        }else{
            if (aspectRatio > 16 / 9) {
                body.style.transform = `scale(${wrapper_h / BODY_H})`;
            } else {
                body.style.transform = `scale(${wrapper_w / BODY_W})`;
            }
        }
    }

    setupButtons(){
        this.buttons = new Buttons();
    }

    updatePlayerBalance(balance , currency){
        const balance_el = document.querySelector('.roulette-balance');
        const balance_label = balance_el.querySelector('.roulette-credential-value');

        balance_label.innerText = balance.toFixed(2) + ` ${currency}`;
    }

    updatePlayerTotalBet(total_bet , currency){
        const total_bet_el = document.querySelector('.roulette-total-bet');
        const total_bet_label = total_bet_el.querySelector('.roulette-credential-value');

        total_bet_label.innerText = total_bet.toFixed(2) + ` ${currency}`;
    }


    createTimer(){
        if(!document.querySelector('.roulette-timer')){
            const body = document.querySelector('.roulette-body');
            const roulette_timer = document.createElement('div');
            roulette_timer.classList.add('roulette-timer');
            roulette_timer.innerHTML = `
                <div class="roulette-progress"></div>
                <label class = "roulette-timer-label"></label>`;

            body.append(roulette_timer);
        }
    }

    destroyTimer(){
        const roulette_timer = document.querySelector('.roulette-timer');
        roulette_timer.remove();
    }
}


class Server{
    constructor(game){
        this.game = game;

        this.init();
    }

    init(){
        this.setupValues();
        this.setupServer();
    }

    setupValues(){
        this.bets_opened = true;
        
        //In ms
        this.bet_interval = undefined;    
        this.bet_time_passed = 0;
        this.bet_total_time = 20000;
        this.bet_update_on = 1000;


        this.game_interval = undefined;    
        this.game_time_passed = 0;
        this.game_total_time = 5000;
        this.game_update_on = 1000;
    }

    setupServer(){
        if(this.bets_opened){
            this.openBets();
        }else{
            this.closeBets();
        }
    }

    openBets(){
        this.bets_opened = true;
        this.game.openBets();

        this.bet_interval = setInterval(() => {
            if(this.bet_time_passed > this.bet_total_time){
                clearInterval(this.bet_interval);
                this.bet_time_passed = 0;
                this.closeBets();
            }else{
                this.game.updateBetState({
                    time_passed: this.bet_time_passed,
                    total_time: this.bet_total_time,
                });

                this.bet_time_passed += this.bet_update_on;
            }
        } , this.bet_update_on);
    }

    closeBets(){
        this.bets_opened = false;
        this.game.closeBets();

        this.game_interval = setInterval(() => {
            if(this.game_time_passed > this.game_total_time){
                this.game.clearBets();
                clearInterval(this.game_interval);
                this.game_time_passed = 0;
                this.openBets();
            }else{
                this.game_time_passed += this.game_update_on;
            }
        } , this.game_update_on);
    }
}

class Game{
    constructor(player){
        this.player = player;
        this.init()
    }
    
    init(){    
        this.setupValues();
    }

    setupValues(){
        this.screen = new Screen();
        this.helper = new Helper();
        this.device = new Device();
        this.bet_buttons = new BetButtons();
        this.server = new Server(this);
    }


    openBets(){
        this.screen.createTimer();
        
        // Tilt the bet Table
        const bet_table_overlay_box = document.querySelector('.roulette-normal-table-overlay');
        const bet_table_overlay_el = bet_table_overlay_box.querySelector('.table-area');

        const bet_table_box = document.querySelector('.roulette-normal-table');
        const bet_table_el = bet_table_box.querySelector('svg');

        if(this.device.type === 'mobile'){
            const neighbour_table_el = document.querySelector('.roulette-neighbour-table');
            const neighbour_table_settings = document.querySelector('.roulette-neighbour-table-settings');
        
            if(this.device.orientation === 'landscape')
                neighbour_table_el.style.transform = 'rotateX(0) translateY(0)';
            else
                neighbour_table_el.style.transform = 'rotate(90deg) scaleY(1.2) translateY(0)';

            neighbour_table_settings.style.opacity = 1;
        }

        bet_table_box.style.perspective = 'none';
        bet_table_el.style.transform = 'rotateX(0) translateY(0)';

        bet_table_overlay_box.style.perspective = 'none';
        bet_table_overlay_el.style.transform = 'rotateX(0) translateY(0)';


        const cells = this.player.cells;
        cells.forEach((cell)=>cell.normalizeColorField());


        const bets_box = document.querySelector('.roulette-bets');
        bets_box.style.opacity = 1;

        if(this.device.type === 'mobile' && this.device.orientation === 'portrait'){
            bets_box.style.transform = 'scale(1)';
        }else{
            bets_box.style.transform = 'translateY(0)';
        }

        const bets_closed_text = document.querySelector('.roulette-bets-closed-text');
        bets_closed_text.classList.remove('active');
    }


    updateBetState({time_passed , total_time}){
        const timer_label = document.querySelector('.roulette-timer-label');

        const time_left = (total_time - time_passed) / 1000;
        timer_label.innerText = time_left;

        // Scale animation
        if(time_left > 3)
            timer_label.classList.remove('scaling');
        else
            timer_label.classList.add('scaling');

        const degrees = time_passed / total_time * 360;

        // Border and color animation
        if(time_left > 7)
            this.timer_color = "#32cd32";
        else if(time_left > 3)
            this.timer_color = "#f5c70f";
        else
            this.timer_color = "#bf0a19";

        const timer_el = document.querySelector('.roulette-timer');
        timer_el.style.background = `conic-gradient(${this.timer_color} 0deg, ${this.timer_color} ${degrees}deg, transparent ${degrees}deg, transparent)`;

        this.helper.circularPulseEffect(timer_el , this.timer_color , this.helper.darkenColor(this.timer_color , 0.2) , degrees)
    }

    closeBets(){
        this.screen.destroyTimer();

        if(this.device.type === 'mobile'){
            this.bet_buttons.closeMenu();
            setTimeout(() => {
                const bet_table_overlay_box = document.querySelector('.roulette-normal-table-overlay');
                const bet_table_overlay_el = bet_table_overlay_box.querySelector('.table-area');

                const neighbour_table_el = document.querySelector('.roulette-neighbour-table');
                const neighbour_table_settings = document.querySelector('.roulette-neighbour-table-settings');

                const bet_table_box = document.querySelector('.roulette-normal-table');
                const bet_table_el = bet_table_box.querySelector('svg');

                if(this.device.orientation === 'landscape'){
                    bet_table_el.style.transform = 'translate(25px , 200px) scale(0.5)';
                    bet_table_overlay_el.style.transform = 'translate(25px , 200px) scale(0.5)';

                    neighbour_table_el.style.transform = 'translate(45px , 175px) scale(0.5)';
                    neighbour_table_settings.style.opacity = 0;
                }else{
                    bet_table_el.style.transform = 'translateY(-100px) scale(0.65)';
                    bet_table_overlay_el.style.transform = 'translateY(-100px) scale(0.65)';

                    neighbour_table_el.style.transform = 'rotate(90deg) translateY(-100px) scale(0.65)';
                    neighbour_table_settings.style.opacity = 0;
                }

                const cells = this.player.cells;
                cells.forEach((cell)=>cell.normalizeColorField());


                const bets_box = document.querySelector('.roulette-bets');
                bets_box.style.opacity = 0;

                if(this.device.type === 'mobile' && this.device.orientation === 'portrait'){
                    bets_box.style.transform = 'scale(0)';
                }else{
                    bets_box.style.transform = 'translateY(200px)';
                }
            } , 200)
        }else{
            // Tilt the bet Table
            const bet_table_overlay_box = document.querySelector('.roulette-normal-table-overlay');
            const bet_table_overlay_el = bet_table_overlay_box.querySelector('.table-area');

            const bet_table_box = document.querySelector('.roulette-normal-table');
            const bet_table_el = bet_table_box.querySelector('svg');

            bet_table_box.style.perspective = '1000px';
            bet_table_el.style.transform = 'rotateX(25deg) translateY(60px)';

            bet_table_overlay_box.style.perspective = '1000px';
            bet_table_overlay_el.style.transform = 'rotateX(25deg) translateY(60px)';

            const cells = this.player.cells;
            cells.forEach((cell)=>cell.normalizeColorField());

            // Hide and move the bets
            const bets_box = document.querySelector('.roulette-bets');
            bets_box.style.opacity = 0;
            bets_box.style.transform = 'translateY(60px)';
        }


        // Show Next game soon text
        const bets_closed_text = document.querySelector('.roulette-bets-closed-text');
        bets_closed_text.classList.add('active');

        // Update players history
        this.player.clearRoundHistory();
    }

    clearBets(){
        this.player.clearBets();
    }
}


class Player{
    constructor(name , balance , currency){
        this.name = name;
        this.balance = balance;
        this.currency = currency;

        this.init();
    }

    init(){
        this.setupValues();
        this.setupScreen();
        this.setupNeighbourNumberChanging();
        this.setupChips();
        this.setupCells();
        this.setupRouletteStats();
        this.setupDoubleBets();
        this.setupRevertHistory();
        this.setupGame();
        this.setupMessages();
    }

    setupValues(){
        this.total_bet = 0;
        this.selected_chip_index = 0;
        this.cur_history = [];
        this.cells = [];

        this.selected_neighbours = 2;
        this.min_neighbours = 0;
        this.max_neighbours = 9;

        this.last_game_history = [];
    }

    setupScreen(){
        this.screen = new Screen();
        this.screen.updatePlayerBalance(this.balance , this.currency);
        this.screen.updatePlayerTotalBet(this.total_bet , this.currency);
    }

    setupNeighbourNumberChanging(){
        const increase_el = document.querySelector('.roulette-neighbours-increase');
        const number_el = document.querySelector('.roulette-neighbours-number');
        const decrease_el = document.querySelector('.roulette-neighbours-decrease');

        increase_el.addEventListener('click' , () => {
            decrease_el.classList.remove('inactive');
            this.selected_neighbours++;
            if(this.selected_neighbours >= this.max_neighbours){
                increase_el.classList.add('inactive');
                this.selected_neighbours = this.max_neighbours;
            }else{
                increase_el.classList.remove('inactive');
            }
            number_el.innerText = this.selected_neighbours;
        })

        decrease_el.addEventListener('click' , () => {
            increase_el.classList.remove('inactive');
            this.selected_neighbours--;
            if(this.selected_neighbours <= 0){
                decrease_el.classList.add('inactive');
                this.selected_neighbours = this.min_neighbours;
            }else{
                decrease_el.classList.remove('inactive');
            }
            number_el.innerText = this.selected_neighbours;
        })

    }


    setupChips(){
        this.chips = new ChipHolder(this , [1 , 2 , 10 , 50 , 200 , 400]);
    }

    setupCells(){
        // Normal table cells
        const normal_cell_els = document.querySelectorAll('[data-type="bet-area"]');

        normal_cell_els.forEach((cell_el) => {
            const cell = new Cell(this , cell_el , "normal");
            this.cells.push(cell);
        })


        // Neighbour table cells
        const neighbour_cell_els = document.querySelectorAll('[data-type="neighbours"]');
        neighbour_cell_els.forEach((cell_el) => {
            const cell = new Cell(this , cell_el , "neighbour");
            this.cells.push(cell);
        })
    }

    setupRouletteStats(){
        const roulette_stats = new RouletteStats();
    }

    setupDoubleBets(){
        const double_btn = document.querySelector('.double-btn');
        double_btn.addEventListener('click' , () => {
            this.doubleBets();
        })
    }

    setupRevertHistory(){
        const revert_history_btn = document.querySelector('.revert-history-btn');
        console.log(revert_history_btn)
        revert_history_btn.addEventListener('click' , () => {
            this.revertHistory();
        })
    }

    setupGame(){
        this.game = new Game(this);
    }

    setupMessages(){
        this.messages = new Messages(this);
    }

    addChip(){
        this.total_bet += this.getBet();
        this.balance -= this.getBet();

        this.screen.updatePlayerBalance(this.balance , this.currency);
        this.screen.updatePlayerTotalBet(this.total_bet , this.currency);
    }

    doubleBets(){
        if(this.total_bet > this.balance)return;

        this.balance -= this.total_bet;

        this.total_bet *= 2;
        this.screen.updatePlayerTotalBet(this.total_bet , this.currency);
        this.screen.updatePlayerBalance(this.balance , this.currency);

        this.cells.forEach((cell) => {
            cell.doubleBet();
        })
    }

    getBet(){
        return this.chips.bets[this.selected_chip_index].value;
    }

    resetBet(){
        this.total_bet = 0;
        this.screen.updatePlayerTotalBet(this.total_bet, this.currency);
    }

    clearBets(){
        for(const cell of this.cells){
            this.resetBet();
            cell.clearBet();
        }
    }

    updateHistory(cell){
        const bet = this.getBet();
        this.cur_history.push({cell , bet});
    }

    revertHistory(){
        const length = this.cur_history.length;
        if(length <= 0)return;

        const { cell , bet } = this.cur_history[length - 1];
        this.cur_history.pop();

        cell.reduceBet(bet);
    }

    clearRoundHistory(){
        this.last_game_history = this.cur_history;
        this.cur_history = [];
    }
}


class Cell{
    constructor(player , element , type){
        this.player = player;
        this.element = element;
        this.type = type;

        this.helper = new Helper();

        this.init();
    }

    init(){
        this.total_bet = 0;
        this.trigger_numbers = this.element.getAttribute('data-number-set').split(',');

        this.device = new Device();

        if(this.device.type === 'pc'){
            this.setupHover();
            this.setupUnhover();
        }

        this.setupClick();
    }

    setupHover(){
        this.element.addEventListener('mouseenter' , () => {
            this.lightenColorField();
        })
    }

    setupUnhover(){
        this.element.addEventListener('mouseleave' , () => {
            this.normalizeColorField();
        });
    }

    lightenColorField(){
        if(this.type === "normal"){
            this.lightenNormalColorField();
        }else{
            this.lightenNeighbourColorField();
        }
    }

    normalizeColorField(){
        if(this.type === "normal"){
            this.normalizeNormalColorField();
        }else{
            this.normalizeNeighbourColorField();
        }
    }

    setupClick() {
        this.element.addEventListener('click', () => {
            if(!this.player.game.server.bets_opened)return;

            if(this.type === "normal"){
                this.addToNormal();
            }else{
                this.addToNeighbours();
            }
        });
    }

    addToNormal(){
        if(this.player.balance < this.player.getBet()){
            // TODO: Add error somewhere on the screen
            console.error("Not enough credit!");
            return;
        }       
        this.player.addChip();
        this.player.updateHistory(this);
        this.total_bet += this.player.getBet();
    
        this.drawNormalChips();
    }

    addToNeighbours(){
        let all_trigger_numbers;

        if(this.trigger_numbers.length === 1){
            all_trigger_numbers = this.helper.findElementsAround(ALL_NUMBERS , this.trigger_numbers[0] , this.player.selected_neighbours);
        }else{
            all_trigger_numbers = this.trigger_numbers;
        }

        if(this.player.balance < all_trigger_numbers.length * this.player.getBet()){
            // TODO: Add error somewhere on the screen
            console.error("Not enough credit!");
            return;
        }

        for(let i = 0; i< all_trigger_numbers.length;i++)
            this.player.addChip();

        this.player.updateHistory(this);
        this.total_bet += all_trigger_numbers.length * this.player.getBet();
    
        this.drawNeighbourChips();
    }

    drawNormalChips(){
        const colors = ['black', 'brown', 'green', 'purple', 'blue', 'red', 'yellow'];
        const ranges = [2000, 400, 200, 50, 10, 2, 1];

        for (let index = 0; index < colors.length; index++) {
            if (this.total_bet >= ranges[index]) {
                const label_text = this.total_bet < 1000 ? this.total_bet : this.total_bet / 1000 + 'k';
                this.element.style.position = 'relative';
                this.element.innerHTML = `
                <div>
                    <img class="chip-block" src="../assets/chip-${colors[index]}.svg">
                    <label class="chip-label">${label_text}</label>
                </div>`;
                
                return;
            }
        }
    }

    drawNeighbourChips(){
        let all_trigger_numbers;

        if(this.trigger_numbers.length === 1){
            all_trigger_numbers = this.helper.findElementsAround(ALL_NUMBERS , this.trigger_numbers[0] , this.player.selected_neighbours);
        }else{
            all_trigger_numbers = this.trigger_numbers;
        }

        const colors = ['black', 'brown', 'green', 'purple', 'blue', 'red', 'yellow'];
        const ranges = [2000, 400, 200, 50, 10, 2, 1];

        all_trigger_numbers.forEach((number)=>{
            const element = document.querySelector(`[data-complete-group="${number}"]`);
            for (let index = 0; index < colors.length; index++) {
                if (this.total_bet >= ranges[index]) {
                    const label_text = this.total_bet < 1000 ? this.total_bet : this.total_bet / 1000 + 'k';
                    element.style.position = 'relative';
                    element.innerHTML = `
                    <div>
                        <img class="chip-block" src="../assets/chip-${colors[index]}.svg">
                        <label class="chip-label">${label_text}</label>
                    </div>`;
                    
                    return;
                }
            } 
        })
       
    }

    lightenNormalColorField(){
        this.trigger_numbers.forEach((number)=>{
            if(!this.player.game.server.bets_opened)return;
            const number_el = document.querySelector(`[data-number="${number}"]`);
            const cur_color = number_el.getAttribute('fill');
            number_el.style.fill = this.helper.lightenColor(cur_color , 0.4);
        });
    }

    lightenNeighbourColorField(){
        let all_trigger_numbers;

        if(this.trigger_numbers.length === 1){
            all_trigger_numbers = this.helper.findElementsAround(ALL_NUMBERS , this.trigger_numbers[0] , this.player.selected_neighbours);
        }else{
            all_trigger_numbers = this.trigger_numbers;
        }
        
        all_trigger_numbers.forEach((number)=>{
            if(!this.player.game.server.bets_opened)return;
            const number_el = document.querySelector(`[data-neighbour-number="${number}"]`);
            const cur_color = number_el.getAttribute('fill');
            number_el.style.fill = this.helper.lightenColor(cur_color , 0.4);
        });

        all_trigger_numbers.forEach((number)=>{
            if(!this.player.game.server.bets_opened)return;
            const number_el = document.querySelector(`[data-number="${number}"]`);
            const cur_color = number_el.getAttribute('fill');
            number_el.style.fill = this.helper.lightenColor(cur_color , 0.4);
        });
    }


    normalizeNormalColorField(){
        this.trigger_numbers.forEach((number)=>{
            const number_el = document.querySelector(`[data-number="${number}"]`);
            const cur_color = number_el.getAttribute('fill');
            number_el.style.fill = this.helper.darkenColor(cur_color , 0);
        });
    }


    normalizeNeighbourColorField(){
        let all_trigger_numbers;

        if(this.trigger_numbers.length === 1){
            all_trigger_numbers = this.helper.findElementsAround(ALL_NUMBERS , this.trigger_numbers[0] , this.player.selected_neighbours);
        }else{
            all_trigger_numbers = this.trigger_numbers;
        }

        all_trigger_numbers.forEach((number)=>{
            const number_el = document.querySelector(`[data-neighbour-number="${number}"]`);
            const cur_color = number_el.getAttribute('fill');
            number_el.style.fill = this.helper.darkenColor(cur_color , 0);
        });

        all_trigger_numbers.forEach((number)=>{
            const number_el = document.querySelector(`[data-number="${number}"]`);
            const cur_color = number_el.getAttribute('fill');
            number_el.style.fill = this.helper.darkenColor(cur_color , 0);
        });
    }

    clearBet(){
        this.total_bet = 0;
        this.element.innerHTML = "";
    }

    doubleBet(){
        if(this.total_bet === 0)return;
        
        this.total_bet *= 2;

        this.drawChips();
    }

    reduceBet(bet){
        this.total_bet -= bet;

        if(this.total_bet !== 0)
            this.drawChips();
        else
            this.clearBet();
    }
}


class Chip{
    constructor(chip_holder , value  , element , index , selected){
        this.chip_holder = chip_holder;
        this.value = value;
        this.index = index;
        this.element = element;
        this.selected = selected;

        this.init();
    }

    init(){
        this.element.addEventListener('click' , () => this.chip_holder.selectBet(this.index));
    }

    select(player){
        player.selected_chip_index = this.index;

        this.selected = true;
        this.element.classList.add("selected");
    }

    deselect(){
        this.selected = false;
        this.element.classList.remove("selected");
    }
}

class ChipHolder{
    constructor(player , bets_values){
        this.player = player;
        this.bets_values = bets_values;
        
        this.init();
    }

    init(){
        this.setupValues();
        this.setupChips();
    }

    setupValues(){
        this.chip_els = document.querySelectorAll('.roulette-chip');
        this.bets = [];
    }

    setupChips(){
        this.bets_values.forEach((bet_value , index) => {
            const bet = new Chip(this ,bet_value , this.chip_els[index] , index , index === this.player.selected_chip_index);
            this.bets.push(bet);
        });
    }

    selectBet(index){
        this.bets.forEach((bet) => {
            bet.deselect();
        })

        this.bets[index].select(this.player);
    }
}


class Messages{
    constructor(player){
        this.player = player;

        this.init();
    }

    init(){
        this.setupVariables();
        this.setupInput();
        this.setupSendMsgBtn();
    }

    setupVariables(){
        this.all_messages = [];
        this.cur_message = null;
        this.cur_chatbox = null;

        this.message_status = 'error';

        this.msg_life_span = 5000;
    }

    setupInput(){
        this.input = document.querySelector('.roulette-message-input');

        this.input.addEventListener('input', function () {
            if (this.value.trim() !== "") {
                this.classList.add('expanded');
            } else {
                this.classList.remove('expanded');
            }
        });
    }

    setupSendMsgBtn(){
        const send_button = document.querySelector('.roulette-send-message');

        send_button.addEventListener('click' , () => {
            this.sendMessage();
        })
    }

    sendMessage(){
        if(this.cur_message){
            this.destroyCurrentMessage();
        }

        this.cur_message = this.input.value;

        this.input.value = "";

        const roulette_body = document.querySelector('.roulette-body');
        this.cur_chat_box = document.createElement('div');
        this.cur_chat_box.classList.add('roulette-chat-box');
    
        this.cur_chat_box.style.left = "-100px";
        this.cur_chat_box.style.opacity = 0;
    
    
        this.cur_chat_box.innerHTML = `
            <label class="message-player-name">${player.name}</label>
            <label class="message-text">${this.cur_message}</label>` +
            (this.message_status ? `<label class="message-status">${this.message_status}</label>` : '');
    
        roulette_body.appendChild(this.cur_chat_box);
    
        // Force reflow to ensure the browser applies the initial state
        this.cur_chat_box.offsetHeight; // Reading this triggers a reflow
    
        this.cur_chat_box.style.left = "10px";
        this.cur_chat_box.style.opacity = 1;

        this.cur_msg_timeout = setTimeout(() => {
            this.destroyCurrentMessage();            
        } , this.msg_life_span)
    }

    destroyCurrentMessage(){
        if(!this.cur_msg_timeout)return;
        
        clearTimeout(this.cur_msg_timeout);

        this.cur_chat_box.style.opacity = 0;
        setTimeout(() => {
            this.cur_message = null;
            // this.message_status = null;
            this.all_messages.push(this.cur_message);
            this.cur_chat_box.remove();
        } , 1000)
    }
}


class RouletteStats {
    constructor() {
        this.statsButton = document.querySelector('.roulette-stats-btn');
        this.statsDialog = document.querySelector('.roulette-statistics');

        this.statsCloseBtn = document.querySelector('.roulette-statistics-close-btn');
        this.tabTriggers = document.querySelectorAll('.tab-trigger');
        this.tabContents = document.querySelectorAll('.tab-content');

        this.init();
    }

    init() {
        this.setupStatisticEventListeners();
    }

    setupStatisticEventListeners() {
        this.statsButton.addEventListener('click', () => {
            this.statsDialog.classList.toggle('opened');
        });

        this.statsCloseBtn.addEventListener('click', () => {
            this.statsDialog.classList.remove('opened');
        });

        this.tabTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const tab = trigger.dataset.tab;
                this.tabTriggers.forEach(t => t.classList.remove('active'));
                this.tabContents.forEach(c => c.classList.remove('active'));
                trigger.classList.add('active');
                document.getElementById(tab).classList.add('active');
            });
        });
    }
}




class NormalTable{
    constructor(parent_el){
        this.parent_el = parent_el;

        this.init();
    }

    init(){
        this.setupTable();
        this.setupOverlay();
    }

    setupTable(){
        this.parent_el.innerHTML = NORMAL_TABLE_EL;
    }


    setupOverlay(){

    }
}


class RoulettePrefferedBets{
    constructor(player){
        this.preffered_btn = document.querySelector('.roulette-preffered-bets-btn');
        this.dialog = document.querySelector('.roulette-favorites');
        this.prefferedBetsCloseBtn = document.querySelector('.roulette-favorites-close-btn');

        this.player = player;
        this.preffered_bets_data = [
            { id: 1, name: 'Favorite Bet 1' },
            { id: 2, name: 'Favorite Bet 2' },
            { id: 3, name: 'Favorite Bet 3' },
        ];

        this.cur_id = 3;

        this.bet_list = document.querySelector('.roulette-favorites-list');
        this.init();
    }

    init(){
        this.setupDialog();
        this.createFavoriteBetBoxes();
        this.addListeners();
        this.setupCreatePrefferedBtns();
    }

    setupDialog(){
        this.preffered_btn.addEventListener('click' , () => {
            this.dialog.classList.toggle('opened');
        })


        this.prefferedBetsCloseBtn.addEventListener('click' , () => {
            this.dialog.classList.remove('opened');
        })
    }

    createFavoriteBetBoxes(){
        this.preffered_bets_data.forEach((bet_data) => {
            this.addData(bet_data);
        })
    }

    addData(bet_data){
        this.bet_list.innerHTML += `
        <div class="roulette-favorite-bet-box id-${bet_data.id}">
            <div class="roulette-favorite-bet-main">
                <div>
                    <input type="text" class="roulette-favorite-bet-edit" />
                    <span class = "roulette-favorite-bet-name">${bet_data.name}</span>
                </div>
                <div>
                    <img class = "roulette-favorite-bet-icon delete" src="../assets/icon-delete.png" alt="">
                    <img class = "roulette-favorite-bet-icon edit" src="../assets/icon-edit.png" alt="">
                    <img class = "roulette-favorite-bet-icon show" src="../assets/icon-show.png" alt="">

                    <img class = "roulette-favorite-bet-icon save" src="../assets/icon-save.png" alt="">
                </div>
            </div>

            <div class="roulette-favorite-bet-table">
                
            </div>
        </div>`;
    }

    addListeners(){
        this.preffered_bets_data.forEach((bet_data) => {
            const addedBox = this.bet_list.querySelector(`.roulette-favorite-bet-box.id-${bet_data.id}`);
            const deleteBtn = addedBox.querySelector('.roulette-favorite-bet-icon.delete');
            const editBtn = addedBox.querySelector('.roulette-favorite-bet-icon.edit');
            const showBtn = addedBox.querySelector('.roulette-favorite-bet-icon.show');
            const saveBtn = addedBox.querySelector('.roulette-favorite-bet-icon.save');

            deleteBtn.addEventListener('click', () => this.deleteBetBox(bet_data.id , addedBox));
            editBtn.addEventListener('click', () => this.editBetBox(addedBox , deleteBtn , editBtn , showBtn , saveBtn));
            showBtn.addEventListener('click', () => this.showBetBox(addedBox , showBtn));
            saveBtn.addEventListener('click', () => this.updateBetBox(bet_data.id , addedBox , deleteBtn , editBtn , showBtn , saveBtn));
        });
    }

   

    setupCreatePrefferedBtns(){
        const createCurBetBtn = document.querySelector('.roulette-add-current-favorite-bet-btn');
        const createNewBetBtn = document.querySelector('.roulette-create-favorite-bet-btn');

        createNewBetBtn.addEventListener('click' , () => {
            const fav_list = document.querySelector('.roulette-favorites-list');
            fav_list.style.display = 'none';

            const bottom_buttons = document.querySelector('.roulette-create-bet-btns');
            bottom_buttons.style.display = 'none';

            const create_menu = document.querySelector('.roulette-create-bet-form');
            create_menu.style.display = 'flex';


            const table_el = document.querySelector('.roulette-favorite-add-bet-table');
            const table = new NormalTable(table_el);
        })

        createCurBetBtn.addEventListener('click' , () => {
            this.cur_id += 1;
            const new_bet = {
                id: this.cur_id,
                name: `Favorite Bet ${this.cur_id}`
            }
            this.addBet(new_bet);
        })
    }

    deleteBetBox(id , box_el){
        box_el.style.transform = "scaleY(0)";
        box_el.style.height = 0;

        this.preffered_bets_data = this.preffered_bets_data.filter(item => item.id !== id);
        setTimeout(() => {
            box_el.remove();            
        }, 300);
    }

    editBetBox(box_el , delete_el , edit_el , show_el , save_el){
        const edit_input = box_el.querySelector('.roulette-favorite-bet-edit');
        const label_el = box_el.querySelector('.roulette-favorite-bet-name');
        
        edit_input.classList.add('active');
        edit_input.value = label_el.textContent;

        delete_el.style.display = 'none';
        edit_el.style.display = 'none';
        show_el.style.display = 'none';

        save_el.style.display = 'block';
    }

    updateBetBox(id ,box_el , delete_el , edit_el , show_el , save_el){
        const edit_input = box_el.querySelector('.roulette-favorite-bet-edit');
        const label_el = box_el.querySelector('.roulette-favorite-bet-name');

        const new_text = edit_input.value;
        edit_input.classList.remove('active');
        label_el.innerText = new_text;

        this.preffered_bets_data = this.preffered_bets_data.map(item => 
            item.id === id ? { ...item, name: new_text } : item
        );

        console.log(this.preffered_bets_data)
        delete_el.style.display = 'block';
        edit_el.style.display = 'block';
        show_el.style.display = 'block';

        save_el.style.display = 'none';
    }

    showBetBox(box_el , show_el){
        const table_el = box_el.querySelector('.roulette-favorite-bet-table');
        table_el.classList.toggle('visible');

        show_el.classList.toggle('active');

        const table = new NormalTable(table_el);
    }

    addBet(new_bet){
        this.preffered_bets_data.push(new_bet);

        this.addData(new_bet);
        this.addListeners();  
    }
}

const p = new RoulettePrefferedBets();




class RouletteAutoplay {
    constructor() {
        this.options = [
            { rounds: 5, amount: 2.00 },
            { rounds: 10, amount: 4.00 },
            { rounds: 25, amount: 10.00 },
            { rounds: 50, amount: 20.00 },
            { rounds: 100, amount: 40.00 },
            { rounds: 200, amount: 80.00}
        ];
        this.container = document.querySelector('.roulette-autoplay-popup');

        this.close_btn = document.querySelector('.roulette-autoplay-close-btn');

        this.bet_container = document.querySelector('.roulette-autoplay-bet-options');

        this.trigger_btn = document.querySelector('.roulette-autoplay');

        this.init();
    }

    init(){
        this.renderOptions();
        this.addCloseButtonHandler();
        this.addTriggerButtonHandler();
    }

    renderOptions() {
        this.options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.className = 'roulette-autoplay-bet-option';
            optionElement.innerHTML = `
                <div>
                    <div class="rounds">${option.rounds}
                        <span class="rounds-label">Rounds</span>
                    </div>
                </div>
                <div class="amount">
                    ${option.amount.toFixed(2)} <span class="currency">BGN</span>
                </div>
                <button class="roulette-autoplay-play-btn" aria-label="Play ${option.rounds} rounds">
                    <svg viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                </button>
            `;
            this.bet_container.appendChild(optionElement);
        });
    }

    addCloseButtonHandler() {
        this.close_btn.addEventListener('click', () => {
            this.container.classList.remove('opened');
        });
    }

    addTriggerButtonHandler(){
        this.trigger_btn.addEventListener('click', () => {
            this.container.classList.toggle('opened');
        })
    }
}

const betManager = new RouletteAutoplay();

const player = new Player("Alex" , 10000 , 'лв.');
