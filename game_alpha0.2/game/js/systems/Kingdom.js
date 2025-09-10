class Kingdom{
    constructor()
    {
        this.MidKingdom = MAP_WIDTH/2;
        //初始化王国边界
        this.LeftEdge = this.MidKingdom;
        this.RightEdge = this.MidKingdom;
    }
    SetEdge(entity)
    {
        if(entity.x<this.LeftEdge)
        {
            this.LeftEdge = entity.x;
        }
        if(entity.x>this.RightEdge)
        {
            this.RightEdge = entity.x;
        }
    }
}