package com.example.cotrace.ui.scan;

import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModel;
import androidx.lifecycle.ViewModelProviders;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.example.cotrace.R;
import com.example.cotrace.ui.settings.SettingsViewModel;

public class ScanFragment extends Fragment {

    private ScanViewModel scanViewModel;


    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        scanViewModel =
                ViewModelProviders.of(this).get(ScanViewModel.class);
        View root = inflater.inflate(R.layout.fragment_scan, container, false);
        final ImageView blackBoxView = root.findViewById(R.id.black_box);

//        final TextView textView = root.findViewById(R.id.text_scan);
        scanViewModel.getText().observe(getViewLifecycleOwner(), new Observer<String>() {
            @Override
            public void onChanged(@Nullable String s) {
//                textView.setText(s);
                blackBoxView.setImageResource(R.drawable.blackbox);
            }
        });
        return root;
    }

}