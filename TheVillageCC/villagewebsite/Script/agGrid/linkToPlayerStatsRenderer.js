class LinkToPlayerStatsRenderer {
    // init method gets the details of the cell to be renderer
    init(params) {
        this.eGui = document.createElement('a');
        var playerId = params.data.id;
        var displayValue = params.getValue();
        this.eGui.innerText = displayValue;
        $(this.eGui).attr("href", "/PlayerDetail.aspx?playerid="+playerId);
        
    }

    getGui() {
        return this.eGui;
    }

    refresh(params) {
        return false;
    }
}