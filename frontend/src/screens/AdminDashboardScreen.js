import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import api from '../services/api';
import { useFocusEffect } from '@react-navigation/native';

const AdminDashboardScreen = () => {
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchBorrowedBooks = async () => {
        try {
            const response = await api.get('/transactions');
            // Logic to find currently borrowed books
            const txs = response.data;
            const latestTxs = {};
            txs.forEach(tx => {
                // If transaction is newer, update it
                if (!latestTxs[tx.book_id._id] || new Date(tx.transactionDate) > new Date(latestTxs[tx.book_id._id].transactionDate)) {
                    latestTxs[tx.book_id._id] = tx;
                }
            });

            // Filter only "borrow" type
            const currentlyBorrowed = Object.values(latestTxs).filter(tx => tx.type === 'borrow');
            setBorrowedBooks(currentlyBorrowed);
        } catch (error) {
            console.error(error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchBorrowedBooks();
        }, [])
    );

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await fetchBorrowedBooks();
        setRefreshing(false);
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.bookTitle}>📖 {item.book_id?.title}</Text>
            <View style={styles.row}>
                <Text style={styles.label}>ผู้ยืม:</Text>
                <Text style={styles.value}>{item.user_id?.username}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>วันที่ยืม:</Text>
                <Text style={styles.value}>{new Date(item.transactionDate).toLocaleDateString('th-TH')}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>แดชบอร์ดผู้ดูแลระบบ</Text>
                <Text style={styles.subHeader}>รายการหนังสือที่ถูกยืมอยู่ในขณะนี้</Text>
            </View>

            <FlatList
                data={borrowedBooks}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={<Text style={styles.emptyText}>ไม่มีรายการหนังสือที่ถูกยืม</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    headerContainer: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center' },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#2c3e50' },
    subHeader: { fontSize: 14, color: '#7f8c8d', marginTop: 5 },

    card: { margin: 15, padding: 20, backgroundColor: '#fff', borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
    bookTitle: { fontSize: 18, fontWeight: 'bold', color: '#34495e', marginBottom: 15 },

    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    label: { fontSize: 16, color: '#95a5a6' },
    value: { fontSize: 16, fontWeight: '500', color: '#2c3e50' },

    emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#bdc3c7' }
});

export default AdminDashboardScreen;
