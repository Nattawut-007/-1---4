import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import api from '../services/api';
import { useFocusEffect } from '@react-navigation/native';

const UsersScreen = () => {
    const [users, setUsers] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/auth/users');
            setUsers(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchUsers();
        }, [])
    );

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await fetchUsers();
        setRefreshing(false);
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.iconContainer}>
                <Text style={styles.iconText}>{item.username.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.username}>{item.username}</Text>
                <Text style={styles.role}>สถานะ: {item.role === 'admin' ? 'ผู้ดูแลระบบ' : 'สมาชิกทั่วไป'}</Text>
                <Text style={styles.date}>สมัครเมื่อ: {new Date(item.createdAt).toLocaleDateString('th-TH')}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>รายชื่อสมาชิกทั้งหมด</Text>
            <FlatList
                data={users}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={<Text style={styles.emptyText}>ไม่พบข้อมูลสมาชิก</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa', padding: 15 },
    header: { fontSize: 20, fontWeight: 'bold', color: '#2c3e50', marginBottom: 15, marginLeft: 5 },

    card: { flexDirection: 'row', padding: 15, marginBottom: 12, backgroundColor: '#fff', borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },

    iconContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#3498db', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    iconText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },

    infoContainer: { flex: 1 },
    username: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50' },
    role: { fontSize: 14, color: '#7f8c8d', marginTop: 2 },
    date: { fontSize: 12, color: '#bdc3c7', marginTop: 2 },

    emptyText: { textAlign: 'center', marginTop: 50, color: '#bdc3c7' }
});

export default UsersScreen;
