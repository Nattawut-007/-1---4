import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity, Alert, Platform } from 'react-native';
import api from '../services/api';
import { useFocusEffect } from '@react-navigation/native';

const HistoryScreen = () => {
    const [transactions, setTransactions] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchHistory = async () => {
        try {
            const response = await api.get('/transactions/history');
            setTransactions(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchHistory();
        }, [])
    );

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await fetchHistory();
        setRefreshing(false);
    }, []);

    const handleReturn = async (bookId) => {
        if (Platform.OS === 'web') {
            if (window.confirm("คุณต้องการคืนหนังสือเล่มนี้ใช่หรือไม่?")) {
                try {
                    await api.post('/transactions/return', { bookId });
                    window.alert('สำเร็จ: คืนหนังสือเรียบร้อยแล้ว');
                    fetchHistory();
                } catch (error) {
                    window.alert('ข้อผิดพลาด: ' + (error.response?.data?.message || 'ไม่สามารถคืนหนังสือได้'));
                }
            }
        } else {
            Alert.alert(
                "ยืนยันการคืน",
                "คุณต้องการคืนหนังสือเล่มนี้ใช่หรือไม่?",
                [
                    { text: "ยกเลิก", style: "cancel" },
                    {
                        text: "คืนหนังสือ",
                        onPress: async () => {
                            try {
                                await api.post('/transactions/return', { bookId });
                                Alert.alert('สำเร็จ', 'คืนหนังสือเรียบร้อยแล้ว');
                                fetchHistory();
                            } catch (error) {
                                Alert.alert('ข้อผิดพลาด', error.response?.data?.message || 'ไม่สามารถคืนหนังสือได้');
                            }
                        }
                    }
                ]
            );
        }
    }

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.bookTitle}>📖 {item.book_id?.title || 'หนังสือ'}</Text>
                <View style={[styles.badge, item.type === 'borrow' ? styles.badgeBorrow : styles.badgeReturn]}>
                    <Text style={styles.badgeText}>{item.type === 'borrow' ? 'ยืมออก' : 'คืนแล้ว'}</Text>
                </View>
            </View>

            <Text style={styles.dateText}>วันที่ทำรายการ: {new Date(item.transactionDate).toLocaleDateString('th-TH')}</Text>

            {item.type === 'borrow' && (
                <TouchableOpacity style={styles.returnButton} onPress={() => handleReturn(item.book_id._id)}>
                    <Text style={styles.returnButtonText}>คืนหนังสือ</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>ประวัติการยืม-คืนของฉัน</Text>
            <FlatList
                data={transactions}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 20 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={<Text style={styles.emptyText}>ไม่มีประวัติการทำรายการ</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa', padding: 15 },
    header: { fontSize: 20, fontWeight: 'bold', color: '#2c3e50', marginBottom: 15, marginLeft: 5 },

    card: { padding: 20, marginBottom: 12, backgroundColor: '#fff', borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },

    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    bookTitle: { fontSize: 18, fontWeight: 'bold', color: '#34495e', flex: 1 },

    badge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 20 },
    badgeBorrow: { backgroundColor: '#f39c12' },
    badgeReturn: { backgroundColor: '#2ecc71' },
    badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

    dateText: { fontSize: 14, color: '#95a5a6', marginBottom: 15 },

    returnButton: { backgroundColor: '#e67e22', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
    returnButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

    emptyText: { textAlign: 'center', marginTop: 50, color: '#bdc3c7', fontSize: 16 }
});

export default HistoryScreen;
