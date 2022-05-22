import React, {useState, useEffect, Fragment} from 'react'

export default function StatisticPage() {
        
    const [orders, setOrders] = useState([])
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [menu, setMenu] = useState([])
    const [statistic, setStatistic] = useState({})
    // {餐點名稱: "測試", 銷售量: 10, 銷售金額: 10}
    
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
        fetch('/menu').then(res => res.json()).then(data => {
            setMenu(data['menu'])
        })
    }, [orders])

    useEffect(() => {

        const statisticCopy = {}
        for(let i = 0; i < menu.length; i++) {
            statisticCopy[menu[i].餐點名稱] = {
                銷售量: 0,
                銷售金額: 0
            }
        }
        console.log(menu)
        console.log(orders)
        console.log(statisticCopy)
        // loop through orders
        for(let i = 0; i < orders.length; i++) {
            Object.keys(orders[i].訂購內容).forEach(key => {
                // find the corresponding menu
                const menuItem = menu.find(item => item.餐點名稱 === key)
                statisticCopy[key].銷售量 += orders[i].訂購內容[key]
                statisticCopy[key].銷售金額 += orders[i].訂購內容[key] * menuItem.價格
            })
        }
        setStatistic(statisticCopy)

    }, [menu])
    
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
            <h2>銷貨統計</h2>
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
                        <th>餐點名稱</th>
                        <th>銷售量</th>
                        <th>銷售金額</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        Object.keys(statistic).map(key => {
                            return (
                                <tr>
                                    <td>{key}</td>
                                    <td>{statistic[key].銷售量} 份</td>
                                    <td>${statistic[key].銷售金額}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            
        </div>
    )
}