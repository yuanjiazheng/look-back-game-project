class time {
    constructor() {
        this.NowTime = 0
        this.stamptime=0;
    }

    update(deltaTime)
    {
        this.stamptime += deltaTime;;
        if(this.stamptime>=100)
        {
            this.NowTime++;
            this.stamptime=0;
        }
        if(this.NowTime > DayTime)
        {
            this.NowTime = 0;
        }
    }
}