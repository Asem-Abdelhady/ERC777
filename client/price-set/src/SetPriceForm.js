import React from "react";

function SetPriceForm(props) {
    return (
        <form onSubmit={props.onSubmit}>
            <div className="input-group mb-3">
                <input type="number" className="form-control" placeholder="Enter the token price"
                       aria-label="Enter the token price" aria-describedby="button-addon2" id="account-input" min="0.01"
                       autoComplete="off" step='0.01'
                       onChange={props.onChange} value={props.input}></input>
                <button className="btn btn-outline-primary" type="submit" id="button-addon2" disabled={props.isEmpty}
                        style={{marginLeft: "12px"}}>Set
                </button>
            </div>
        </form>
    )
}

export default SetPriceForm;