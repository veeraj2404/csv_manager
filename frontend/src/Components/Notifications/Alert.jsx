import React from 'react'

export default function Alert(props) {
    var message = props.message; 

    return (
        <>
            <div className="alert alert-warning alert-dismissible fade show mt-4" role="alert">
                <strong>Welcome to File Editor! </strong> {message}
                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        </>
    )
}
