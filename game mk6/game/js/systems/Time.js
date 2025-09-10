class time {
    constructor() {
        this.NowTime = 0
        this.stamptime=0;
    }

    update(deltaTime)
    {
        this.stamptime++;
        if(this.stamptime>=10)
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