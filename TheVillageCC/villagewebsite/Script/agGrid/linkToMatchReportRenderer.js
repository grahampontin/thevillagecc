class LinkToMatchReportRenderer {
    // init method gets the details of the cell to be renderer
    init(params) {
        this.eGui = document.createElement('a');
        var matchId = params.data.id;
        var displayValue = params.getValue();
        this.eGui.innerText = displayValue;
        $(this.eGui).attr("href", "/LiveScorecard.aspx?matchId="+matchId);
        
    }

    getGui() {
        return this.eGui;
    }

    refresh(params) {
        return false;
    }
}