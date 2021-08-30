module.exports = (data) => {
    return [
        {
            "contentType": "application/vnd.microsoft.card.adaptive",
            "content": {
                "type": "AdaptiveCard",
                "version": "1.0",
                "body": [
                    {
                        type: 'ColumnSet',
                        columns: Object.keys(data[0]).map(col => {
                            return {
                                type: 'Column',
                                width: 'stretch',
                                spacing: 'medium',
                                separator: true,
                                items: [
                                    {
                                        "type": "TextBlock",
                                        "weight": "bolder",
                                        "text": col
                                    },
                                    ...data.map(item => {
                                        return {
                                            type: 'TextBlock',
                                            text: item[col]
                                        }
                                    })
                                ]
                            }
                        })
                    }
                ]
            }
        }
    ]
}