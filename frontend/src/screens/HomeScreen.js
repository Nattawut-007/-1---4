import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, RefreshControl, Platform } from 'react-native';
import api from '../services/api';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = () => {
    const [books, setBooks] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchBooks = async () => {
        try {
            const response = await api.get('/books');
            setBooks(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchBooks();
        }, [])
    );

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await fetchBooks();
        setRefreshing(false);
    }, []);

    const handleBorrow = async (bookId) => {
        if (Platform.OS === 'web') {
            if (window.confirm("คุณต้องการยืมหนังสือเล่มนี้ใช่หรือไม่?")) {
                try {
                    await api.post('/transactions/borrow', { bookId });
                    window.alert('สำเร็จ: ยืมหนังสือเรียบร้อยแล้ว');
                    fetchBooks();
                } catch (error) {
                    window.alert('ข้อผิดพลาด: ' + (error.response?.data?.message || 'ไม่สามารถยืมหนังสือได้'));
                }
            }
        } else {
            Alert.alert(
                "ยืนยันการยืม",
                "คุณต้องการยืมหนังสือเล่มนี้ใช่หรือไม่?",
                [
                    { text: "ยกเลิก", style: "cancel" },
                    {
                        text: "ยืนยัน",
                        onPress: async () => {
                            try {
                                await api.post('/transactions/borrow', { bookId });
                                Alert.alert('สำเร็จ', 'ยืมหนังสือเรียบร้อยแล้ว');
                                fetchBooks();
                            } catch (error) {
                                Alert.alert('ข้อผิดพลาด', error.response?.data?.message || 'ไม่สามารถยืมหนังสือได้');
                            }
                        }
                    }
                ]
            );
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={{ flex: 1 }}>
                <Text style={styles.bookTitle}>📖 {item.title}</Text>
                <Text style={styles.bookAuthor}>ผู้แต่ง: {item.author}</Text>
                <Text style={[styles.status, item.status === 'available' ? styles.statusAvailable : styles.statusBorrowed]}>
                    {item.status === 'available' ? 'สถานะ: ว่าง' : 'สถานะ: ถูกยืมแล้ว'}
                </Text>
            </View>
            {item.status === 'available' ? (
                <TouchableOpacity style={styles.borrowButton} onPress={() => handleBorrow(item._id)}>
                    <Text style={styles.borrowButtonText}>ยืมหนังสือ</Text>
                </TouchableOpacity>
            ) : (
                <View style={styles.disabledButton}>
                    <Text style={styles.disabledButtonText}>ไม่ว่าง</Text>
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>รายการหนังสือทั้งหมด</Text>
                <Text style={styles.subHeader}>เลือกยืมหนังสือที่คุณสนใจ</Text>
            </View>
            <FlatList
                data={books}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 20 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    headerContainer: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee', marginBottom: 10 },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#2c3e50' },
    subHeader: { fontSize: 14, color: '#7f8c8d', marginTop: 5 },

    card: { flexDirection: 'row', padding: 15, marginHorizontal: 15, marginBottom: 12, backgroundColor: '#fff', borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },

    bookTitle: { fontSize: 18, fontWeight: 'bold', color: '#34495e', marginBottom: 4 },
    bookAuthor: { fontSize: 14, color: '#7f8c8d', marginBottom: 6 },

    status: { fontSize: 14, fontWeight: 'bold', marginTop: 2 },
    statusAvailable: { color: '#27ae60' },
    statusBorrowed: { color: '#e74c3c' },

    borrowButton: { backgroundColor: '#3498db', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8 },
    borrowButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },

    disabledButton: { backgroundColor: '#bdc3c7', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
    disabledButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' }
});

export default HomeScreen;
