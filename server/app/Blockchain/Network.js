function ConnectNodes(chain, req) {
    const { nodes } = req.body

    if (nodes.length > 0){
        for (let i = 0; i < nodes.length; i++) {
            chain.addNodes(nodes[i])
        }

        let data = {
            'message' : 'Connected to the network',
            'node_list' : chain.nodes
        }

        return data;
    }else{
        console.log('no nodes to add')
    }
  }

  module.exports = {
      ConnectNodes
  };