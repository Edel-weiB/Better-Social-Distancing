package com.example.cotrace.ui.history;

import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProviders;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.example.cotrace.R;
import com.example.cotrace.ui.hotspot.HotspotViewModel;

public class HistoryFragment extends Fragment {

    private HistoryViewModel historyViewModel;
    SharedPreferences preferences;
    TextView history_location;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {

        preferences = getContext().getSharedPreferences("Location", Context.MODE_PRIVATE);
        historyViewModel =
                ViewModelProviders.of(this).get(HistoryViewModel.class);
        View root = inflater.inflate(R.layout.fragment_history, container, false);


        history_location = root.findViewById(R.id.location1);
        String placeholder = "Unknown";
        String location = preferences.getString("loc", placeholder);
        String date_n_time = preferences.getString("date_and_time", placeholder);

        history_location.setText(location + "\n" + date_n_time);


        return root;
    }
}