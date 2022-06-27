import React, {Component} from "react";


function BuyATForm(props) {
    return (
        <form onSubmit={props.onSubmit}>
            <div className="input-group mb-3">
                <input type="number" className="form-control" placeholder="Enter the tokens amount"
                       aria-label="Enter the tokens amount" aria-describedby="button-addon2" id="account-input" min="1" autoComplete="off"
                       onChange={props.onChange} value={props.input}></input>
                <button className="btn btn-outline-primary" type="submit" id="button-addon2" disabled={props.isEmpty}
                        style={{marginLeft: "12px"}}>Buy
                </button>
            </div>
        </form>
    )
}

export default BuyATForm;