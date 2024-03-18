import React from 'react'
import ConnectWeb3 from '../components/ConnectWeb3'
import AddActivity from '../components/addActivityBlock'
import AddActyivity from '../components/Add_activity'
import ToContract from '../components/ToContract'

function Wallet() {
    return (
        <div>
                <ConnectWeb3 />
                {/* <AddActivity /> */}
                {/* <AddActyivity /> */}
                {<ToContract />}
        </div>

    )
}

export default Wallet