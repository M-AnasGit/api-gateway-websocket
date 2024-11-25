const { ApiGatewayManagementApiClient, DeleteConnectionCommand, PostToConnectionCommand } = require('@aws-sdk/client-apigatewaymanagementapi')

class Gateway {
	constructor(apiConfig, dev = false) {
		this.client = new ApiGatewayManagementApiClient(apiConfig)
		this.dev = dev
	}

	/**
	 * Disconnects a connection
	 *
	 * @param {string} connectionId - The connection ID to disconnect
	 *
	 * @returns {Promise<void>}
	 */
	async disconnect(connectionId) {
		try {
			await this.client.send(new DeleteConnectionCommand({ ConnectionId: connectionId }))
		} catch (error) {
			if (this.dev) console.error('Error disconnecting: ', error)
		}
	}

	/**
	 * Sends data to a connection
	 *
	 * @param {string} connectionId - The connection ID to send data to
	 * @param {JSON} data - The data to send
	 *
	 * @returns {Promise<void>}
	 */
	async sendData(connectionId, data) {
		try {
			await this.client.send(new PostToConnectionCommand({ ConnectionId: connectionId, Data: data }))
		} catch (error) {
			if (this.dev) console.error('Error sending data: ', error)
		}
	}

	/**
	 * Sends data to multiple connections
	 *
	 * @param {Array<string>} connectionIds - The connection IDs to send data to
	 * @param {JSON} data - The data to send
	 *
	 * @returns {Promise<void>}
	 */
	async sendDataToMultiple(connectionIds, data) {
		try {
			const promises = connectionIds.map((connectionId) => this.sendData(connectionId, data))
			await Promise.all(promises)
		} catch (error) {
			if (this.dev) console.error('Error sending data to multiple connections:', error)
		}
	}
}

module.exports = Gateway
