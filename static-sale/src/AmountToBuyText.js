import React, {Component} from "react";

function AmountToBuyText (props){
    return(
        <p className="text-center h4" style={{marginBottom:"30px"}}>Buy AT tokens now for {props.tokenPrice} ethers each</p>
    )

}


export default AmountToBuyText;