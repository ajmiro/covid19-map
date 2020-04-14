import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';
import moment from 'moment-timezone';
import { Statistic, Drawer, Button, Table } from 'antd';

const StyledAside = styled.aside`
    width: ${props => props.width};
    background: #111111;
    padding: 15px;
    h1{
        color: #eee;
        font-size: 2em;
    }
    p{
        color: #eee;
        line-height: 1.2;
        padding-bottom: 15px;
    }
    .ant-statistic {
        background: #fff;
        padding: 20px;
        border: 1px solid #ddd;
        margin-bottom: 15px;
    }
    .ant-statistic-content{
        font-size: 3em;
        font-family: sans-serif;
    }
`

const StyleLastUpdated = styled.div`
    font-size: 12px;
    color: #eee;
    padding-top: 15px;
`
/**
 * TODO: 
 * - search by country
 * - combine countries together
 * - cluster the data
 * 
 */
const Aside = ({ isSidebarClose, onSidebarToggle, data }) => {
    const [cases, setCases] = useState([]);
    const [asideStyle, setAsideStyle] = useState({ width: '20%'})
    const [lastUpdated, setLastUpdated] = useState();
    const [isShowMoreInfo, setIsShowMoreInfo] = useState(false);

    const getSum = ( key, data ) => {
        return data.reduce((previousValue, currentValue) => {
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
                    value: getSum('confirmed', data),
                    color: 'red'
                },
                { 
                    label: 'deaths', 
                    value: getSum('deaths', data),
                    color: 'black'
                },
                { 
                    label: 'recovered',
                    value: getSum('recovered', data),
                    color: '#3f8600'
                }
            ])
            
            setLastUpdated( moment(data[0].updatedAt).format('llll z') )
        }
    }, [ data ])

    useEffect(() => {
        if(isSidebarClose) {
            setAsideStyle({ width: 0 })
        } else {
            setAsideStyle({ width: '20%' })
        }
    }, [ isSidebarClose ])

    const columns = [
        {
            title: 'Country',
            dataIndex: 'country',
            key: 'country',
        },
        {
            title: 'Confirmed',
            render: (item) => {
                return item.stats.confirmed
            },
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.stats.confirmed - b.stats.confirmed,
            key: 'stats.confirmed'
        },
        {
            title: 'Deaths',
            // dataIndex: 'stats.deaths',
            render: (item) => {
                return item.stats.deaths
            },
            sorter: (a, b) => a.stats.deaths - b.stats.deaths,
            key: 'stats.deaths'
        },
        {
            title: 'Recovered',
            render: (item) => {
                return item.stats.recovered
            },
            sorter: (a, b) => a.stats.recovered - b.stats.recovered,
            key: 'stats.recovered'
        }
    ]

    return (
        <StyledAside {...asideStyle}>
            {/* <span onClick={() => onSidebarToggle() }>CLOSE SIDEBAR</span> */}
            <h1>COVID19 CASES </h1>
            <p>
                Hover points in the map to show number of confirmed, deaths and recovered cases.
            </p>
            <div className={'aside-wrapper'}>
                <div> 
                    { cases.map( item => {
                        return (
                            <React.Fragment key={uuidv4()}>
                                <Statistic
                                    key={uuidv4()}
                                    title={item.label}
                                    value={item.value}
                                    precision={0}
                                    valueStyle={{ color: item.color }}
                                />
                            </React.Fragment>)
                    })}
                </div>
                <Button block onClick={() => setIsShowMoreInfo(true) }>Show more information</Button>
                {
                    lastUpdated && 
                    <StyleLastUpdated>
                        Last updated: { lastUpdated }
                    </StyleLastUpdated>
                }
                <Drawer
                    title="The table below shows all countries with corresponding confirmed, deaths and recovered cases"
                    placement="right"
                    closable={true}
                    onClose={() => setIsShowMoreInfo(false)}
                    visible={isShowMoreInfo}
                    width={'50%'}
                >
                    <Table dataSource={data} columns={columns} />
                </Drawer>
            </div>
        </StyledAside>
    )
}

export default Aside;