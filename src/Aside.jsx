import React, { useState, useEffect } from 'react';
import OutlinedCard from './OutlinedCard';
import { v4 as uuidv4 } from 'uuid';
import Drawer from './Drawer';
import styled from 'styled-components';
import moment from 'moment-timezone';

const StyleLastUpdated = styled.div`
    font-size: 12px;
    background: '#eee';
    padding: 10px;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
`

const Aside = ({ isSidebarClose, onSidebarToggle, data }) => {
    const [dataFilter, setDataFilter] = useState('cases');
    const [cases, setCases] = useState([]);
    const [asideStyle, setAsideStyle] = useState({ width: '20%'})
    const [lastUpdated, setLastUpdated] = useState();

    const getSum = ( key, data ) => {
        return data.reduce((previousValue, currentValue) => {
            console.log( { previousValue, currentValue })
            if(typeof previousValue === 'number'){
                return previousValue + currentValue.stats[key] 
            }

            return previousValue.stats[key] + currentValue.stats[key]
        }) 
    }
    useEffect(() => {
        if( data ) {
            setCases([
                { 
                    label: 'confirmed',
                    value: getSum('confirmed', data)
                },
                { 
                    label: 'deaths', 
                    value: getSum('deaths', data) 
                },
                { label: 'recovered',
                    value: getSum('recovered', data) 
                }
            ])
            
            setLastUpdated( moment(data[0].updatedAt).format('llll z') )
        }
    }, [ data,  ])

    useEffect(() => {
        if(isSidebarClose) {
            setAsideStyle({ width: 0 })
        } else {
            setAsideStyle({ width: '20%' })
        }
    }, [ isSidebarClose ])

    return (
        <aside style={asideStyle}>
            {/* <span onClick={() => onSidebarToggle() }>CLOSE SIDEBAR</span> */}
            <div className={'aside-wrapper'}>
                <div> 
                    { cases.map( item => {
                        return <OutlinedCard label={item.label} value={item.value} key={uuidv4()} setDataFilter={setDataFilter} />
                    })}
                </div>
                {
                    lastUpdated && 
                    <StyleLastUpdated>
                        Last updated: { lastUpdated }
                    </StyleLastUpdated>
                }
            </div>
        </aside>
    )
}

export default Aside;