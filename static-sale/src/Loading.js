import shikamaru from './loading.jpg'
import React from "react";

function Loading(props) {
    return (
        <div id="loader" className="text-center">
            <img src={shikamaru} alt="Shikamaru is dying but the transaction is being processed!"
                 style={{margin: "30px"}}/>
            <p className="text-center">Loading the transaction nenjtsu !</p>
        </div>
    )
}

export default Loading;