package com.example.cotrace.ui.hotspot;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProviders;

import com.example.cotrace.MapsActivity;
import com.example.cotrace.QRreader;
import com.example.cotrace.R;

public class HotspotFragment extends Fragment {

    private HotspotViewModel hotspotViewModel;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        hotspotViewModel =
                ViewModelProviders.of(this).get(HotspotViewModel.class);
        View root = inflater.inflate(R.layout.fragment_hotspots, container, false);
        final TextView textView = root.findViewById(R.id.text_hotspots);
        hotspotViewModel.getText().observe(getViewLifecycleOwner(), new Observer<String>() {
            @Override
            public void onChanged(@Nullable String s) {
                textView.setText(s);
            }
        });
        Button mapButton = root.findViewById(R.id.mapBtn);
        mapButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(getContext(), MapsActivity.class));
            }
        });
        return root;
    }
}