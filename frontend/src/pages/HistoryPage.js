import React, {useState, useEffect, Fragment} from 'react'

export default function HistoryPage() {
    
        const [orders, setOrders] = useState([])
        const [currentOrder, setCurrentOrder] = useState({})
        const [startDate, setStartDate] = useState('')
        const [endDate, setEndDate] = useState('')
    
        useEffect(() => {
            fetch('/history').then(res => res.json()).then(data => {
                setOrders(Object.keys(data).map(key =>{
                    return {
                        訂單編號: key,
                        ...data[key]
                    }
                }))
            })
        }, [])

        useEffect(() => {
            let query = ''
            if(startDate !== '') {
                query += `dateBegin=${startDate}`
            }
            if(endDate !== '') {
                if (query !== '') {
                    query += '&'
                }
                query += `dateEnd=${endDate}`
            }

            fetch(`/history?${query}`).then(res => {
                if(res.ok) {
                   return res.json() 
                }
                return {}
            }).then(data => {
                setOrders(Object.keys(data).map(key =>{
                    return {
                        訂單編號: key,
                        ...data[key]
                    }
                }))
            })
        }, [startDate, endDate])
    
        return (
            <div className="card">
                <h2>歷史訂單</h2>
                

                {
                    Object.keys(currentOrder).length === 0 ?
                        <Fragment>
                            <div>
                                <div>
                                    <label htmlFor="start">Start date:</label>
                                    <input type="date" id="start" name="time-start" onChange={e => setStartDate(e.target.value.replaceAll('-', ''))}/>
                                </div>
                                <div>
                                    <label htmlFor="end">End date:</label>
                                    <input type="date" id="end" name="time-end" onChange={e => setEndDate(e.target.value.replaceAll('-', ''))}/>
                                </div>
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>訂單編號</th>
                                        <th>訂單時間</th>
                                        <th>訂單金額</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        orders.map(order => {
                                            return (
                                                <tr key={order.訂單編號} onClick={() => setCurrentOrder(order)}>
                                                    <td>{order.訂單編號}</td>
                                                    <td>{order.訂購時間}</td>
                                                    <td>$ {order.總金額}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </Fragment>
                        :
                        <div className='card min-width-80'>
                            <h2>訂單 {currentOrder.訂單編號} 號紀錄</h2>
                            <p>訂購時間: {currentOrder.訂購時間}</p>
                            <table>
                                <thead>
                                    <tr>
                                        <th>餐點名稱</th>
                                        <th>餐點數量</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        Object.keys(currentOrder.訂購內容).map(key => {
                                            return (
                                                <tr key={key}>
                                                    <td>{key}</td>
                                                    <td>{currentOrder.訂購內容[key]}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                            <p>總金額: ${currentOrder.總金額}</p>
                            <button className='btn-1' onClick={() => setCurrentOrder({})}>返回</button>
                        </div>
                }
                
            </div>
        )
}